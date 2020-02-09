import { Socket } from "socket.io";
import { genUniqueId } from "../logic/api";
import Game from "../logic/Game";
import { ChessColor } from "../logic/types";
import * as config from "./config";
import { BaseResponse as FlagResponse, BaseResponse } from "./protocol";
import Room from "./room";
import { RoomStatus, UserStatus } from "./types";
import User from "./user";
import Rule, { KlzRule } from "./rule";
import actionFactory from "./messageHandle/factory/actionFactory";
import MessageType from "./messageType";

export interface IRoomInfo {
  id: string;
  name: string;
  status: RoomStatus;
  userIdList: string[];
  userStatusList: UserStatus[];
  gameId: string;
}

const { ROOM_COUNT } = config;

class Lobby {
  /**socket列表 */
  socketList: Socket[] = [];
  /**房间列表 */

  roomList: Room[] = [];
  /**用户列表 */
  userList: User[] = [];
  /**游戏列表 */
  gameList: Game[] = [];

  /**大厅id */
  id: string;
  constructor() {
    this.id = genUniqueId();
    // 系统生成房间
    let rule = KlzRule;
    for (let i = 0; i < ROOM_COUNT; i++) {
      let name = `${i}号房间`;
      this.createRoom(name, rule);
    }
  }

  findSocket(id: string): Socket {
    return this.socketList.find(n => n.id === id);
  }

  findRoom(id: string): Room {
    return this.roomList.find(n => n.id === id);
  }

  findUser(id: string): User {
    return this.userList.find(n => n.id === id);
  }

  findGame(id: string): Game {
    return this.gameList.find(n => n.id === id);
  }

  findGameByUserId(id: string): Game {
    let user = this.findUser(id);
    let game = this.findGame(user.gameId);
    return game;
  }

  /**获取大厅信息 */

  getLobbyInfo(): IRoomInfo[] {
    return this.roomList.map(ro => {
      return this.getRoomInfo(ro);
    });
  }

  /**获取房间细节信息 */

  getRoomInfo(room: Room): IRoomInfo {
    return {
      id: room.id,
      name: room.name,
      status: room.status,
      userIdList: room.userIdList,
      userStatusList: room.userIdList.map(userId => {
        let user = this.findUser(userId);
        return user ? user.status : undefined;
      }),
      gameId: room.gameId
    };
  }

  private createGameByRule(rule: Rule): Game {
    if (rule.gameName === "卡拉赞象棋") {
      let game = new Game();
      game.chessBoard.readMap("normal");
      return game;
    }
    throw "no such game:" + rule.gameName;
  }

  /**增加一个socket */
  addSocket(socket: Socket): void {
    this.socketList.push(socket);
  }

  removeSocket(socketId: string): void {
    let socket = this.findSocket(socketId);
    if (socket) {
      this.socketList = this.socketList.filter(
        socket => socket.id !== socketId
      );

      socket.leaveAll();
    }
  }

  // 能否增加一个用户
  canAddUser(userId: string): boolean {
    return !this.findUser(userId);
  }

  /**
   * 增加一个用户
   * 一般用在socket刚连接的时候,把它加上去
   * @param id 用户id,即socket.id
   */
  addUser(id: string): void {
    let user = new User();
    user.id = id;
    user.roomId = undefined;
    user.gameId = undefined;
    user.status = "idle";
    this.userList.push(user);
  }

  // 删除一个用户
  // 一般用在socket断开连接的时候
  removeUser(userId: string): void {
    let user = this.findUser(userId);
    if (!user) {
      return;
    }

    // room
    let can = this.canLeaveRoom(userId);
    if (can.code === 0) {
      this.leaveRoom(userId);
    }

    this.userList = this.userList.filter(user => user.id !== userId);
  }

  /**
   * Creates room
   * @param name 房间名字
   * @param rule 房间中游戏的规则
   */
  private createRoom(name: string, rule: Rule): void {
    let room = new Room();
    room.id = genUniqueId();
    room.name = name;
    room.status = "idle";
    room.userIdList = [];
    room.gameId = undefined;
    room.rule = rule;

    this.roomList.push(room);
  }

  /**
   * 房间是否已经满足人数
   * @param room 房间
   */
  isRoomFull(room: Room): boolean {
    return room.rule.requiredPlayer <= room.userIdList.length;
  }

  /**用户能否进入房间 */
  canEnterRoom(userId: string, roomId: string): FlagResponse {
    let rst: FlagResponse = { code: 0 };
    // 用户是否存在
    // 用户是否已经有房间
    // 用户是否已经在游戏中
    // 房间是否存在
    // 房间是否满员
    // 房间状态是否允许

    let user = this.findUser(userId);
    if (!user) {
      return { code: -1, message: "用户不存在" };
    }
    if (user.roomId) {
      return { code: -2, message: "用户已经在某个房间中" };
    }
    if (user.gameId) {
      return { code: -3, message: "用户已经在游戏中" };
    }
    let room = this.findRoom(roomId);
    if (!room) {
      return { code: -4, message: "房间不存在" };
    }
    if (this.isRoomFull(room)) {
      return { code: -5, message: "房间状态不允许增加用户" };
    }

    return rst;
  }

  /**
   * 加入房间
   * @param userId 用户id
   * @param roomId 房间id
   */
  enterRoom(userId: string, roomId: string): void {
    let socket = this.findSocket(userId);
    let user = this.findUser(userId);
    let room = this.findRoom(roomId);

    // socket加入到roomId
    socket.join(roomId);
    // 用户的房间Id设置为roomId
    user.roomId = roomId;
    // 房间的用户id列表加上userId,最后判断下房间是否已经满员
    room.userIdList.push(userId);
    // 如果用户加入的房间为offline,且用户是用户列表中的一位,则重连游戏
    // todo
  }

  /**
   * 是否能离开房间
   * @param userId 用户id
   * @returns FlagResponse
   */
  canLeaveRoom(userId: string): BaseResponse {
    let rst: BaseResponse = { code: 0 };
    // 用户存在
    // 用户在房间中
    let user = this.findUser(userId);
    let roomId = user.roomId;
    let room = this.findRoom(roomId);
    if (!room) {
      return { code: -1, message: "房间不存在" };
    }
    if (!room.userIdList.find(id => id === userId)) {
      return { code: -2, message: "用户不在房间中" };
    }

    return rst;
  }

  // 离开房间
  leaveRoom(userId: string): void {
    let socket = this.findSocket(userId);
    let user = this.findUser(userId);

    let roomId = user.roomId;
    let room = this.findRoom(roomId);

    // socket退出room
    socket.leave(roomId);
    // 用户退出房间
    user.roomId = undefined;
    // 房间的用户id列表移除用户的id
    room.userIdList = room.userIdList.filter(id => id !== userId);
    // todo
    // 如果房间已经在游戏了,应该设置为断线
  }

  // 玩家能否准备
  canUserReady(userId: string): FlagResponse {
    let rst: FlagResponse = { code: 0 };

    // // 用户已经准备
    // let user = this.findUser(userId);
    // if (user.status === UserStatus.ready) {
    //   return { code: -1, message: "用户已经准备" };
    // }

    // let roomId = user.roomId;
    // let room = this.findRoom(roomId);
    // // 房间已经开始开始游戏
    // if (room.status === RoomStatus.play) {
    //   return { code: -2, message: "房间已经开始游戏" };
    // }

    return rst;
  }

  // 玩家准备
  userReady(userId: string): void {
    let user = this.findUser(userId);
    user.status = "ready";
  }

  canUserUnReady(userId: string): FlagResponse {
    let rst: FlagResponse = { code: 0 };
    // // 用户尚未准备
    // let user = this.findUser(userId);
    // if (user.status === UserStatus.notReady) {
    //   return { code: -1, message: "用户尚未准备" };
    // }

    // let roomId = user.roomId;
    // let room = this.findRoom(roomId);
    // // 房间已经开始开始游戏
    // if (room.status === RoomStatus.play) {
    //   return { code: -2, message: "房间已经开始游戏" };
    // }

    return rst;
  }

  // 玩家反准备
  userUnReady(userId: string): void {
    let user = this.findUser(userId);
    user.status = "idle";
  }

  // 是否房间可以开始游戏
  // 是否房间中的玩家已经满员,且都已经准备
  canStartGame(roomId: string): BaseResponse {
    let room = this.findRoom(roomId);
    if (!room) {
      return { code: -1, message: "找不到房间" };
    }

    // 是否满员
    if (!this.isRoomFull(room)) {
      return { code: -2, message: "房间游戏人数不够" };
    }

    let isAllReady: boolean = room.userIdList.every(userId => {
      let user = this.findUser(userId);
      return user && user.status === "ready";
    });
    if (!isAllReady) {
      return { code: -3, message: "房间中的人没有准备好" };
    }

    return { code: 0 };
  }

  // 开始游戏
  // 根据roomId找到gameId
  startGame(roomId) {
    let room = this.findRoom(roomId);
    let game = this.createGameByRule(room.rule);
    game.setChannel((type, data) => {
      console.log("in channel", type, data);
      this.notifyAllInRoom(roomId, type, data);
    });
    this.gameList.push(game);

    room.gameId = game.id;
    room.status = "play";

    room.userIdList.forEach(userId => {
      let user = this.findUser(userId);
      user.gameId = game.id;
    });

    let chBoard = game.chessBoard;
    room.userIdList.forEach((userId, i) => {
      chBoard.addPlayer(userId, i === 0 ? "red" : "black");
    });
    chBoard.start();
  }

  notifyAllInRoom(roomId: string, type: MessageType, data: any) {
    let room = this.findRoom(roomId);
    // console.log("messageHandle.notifyAllInRoom:", room.userIdList);
    room.userIdList
      .map(userId => lobby.findSocket(userId))
      .forEach(socket => {
        if (!socket) {
          throw "invalid socket";
        }
        socket.send(type, data);
      });
  }
}

let lobby: Lobby;
if (!lobby) {
  lobby = new Lobby();
}

export default lobby;
