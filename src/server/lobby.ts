import Room, { RoomStatus } from "./room";
import User, { UserStatus } from "./user";
import Game from "../logic/Game";
import { Socket } from "socket.io";
import { BaseResponse } from "./protocol";
import { BasePrivateKeyEncodingOptions } from "crypto";

export interface IRoomInfo {
  id: string;
  name: string;
  status: RoomStatus;
  userIdList: string[];
  gameId: string;
}

// 游戏需要的人数
const GAME_USER_COUNT = 2;

class Lobby {
  private socketList: Socket[] = [];
  // 房间列表
  private roomList: Room[] = [];
  // 用户列表
  private userList: User[] = [];
  // 游戏列表
  private gameList: Game[] = [];

  constructor() {
    // 系统生成房间
    const ROOM_COUNT = 10;
    this.create(ROOM_COUNT);
  }

  private create(count: number): void {
    for (let i = 0; i < count; i++) {
      let name = `${i}号房间`;
      let room = new Room(name);
      this.roomList.push(room);
    }
  }

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

  // 增加一个用户
  // 一般用在socket刚连接的时候,把它加上去
  addUser(userId: string): void {
    let user = new User();
    user.id = userId;
    user.status = UserStatus.notReady;
    this.userList.push(user);
  }

  // 删除一个用户
  // 一般用在socket断开连接的时候
  removeUser(userId: string): void {
    let user = this.findUser(userId);
    if (user) {
      this.userList = this.userList.filter(user => user.id !== userId);

      let roomId = user.roomId;
      if (roomId) {
        let room = this.findRoom(roomId);
        room.userIdList = room.userIdList.filter(id => id !== roomId);
        room.status = RoomStatus.notFull;
      }
    }
  }

  // 能否加入房间
  canEnterRoom(userId: string, roomId: string): BaseResponse {
    let rst: BaseResponse = { code: 0 };
    let user = lobby.findUser(userId);
    // 如果已经在房间了,就不能进入了
    if (user.roomId) {
      return { code: -1, message: "已经在房间了" };
      return rst;
    }

    let room = lobby.findRoom(roomId);
    if (room) {
      if (room.userIdList.length === 2) {
        return { code: -3, message: "房间已经满员了" };
      }
    } else {
      return { code: -2, message: "找不到该id的房间" };
    }
    return rst;
  }

  // 加入房间
  enterRoom(userId: string, roomId: string): void {
    let socket = this.findSocket(userId);
    let user = this.findUser(userId);
    let room = this.findRoom(roomId);

    socket.join(roomId);
    user.roomId = roomId;
    room.userIdList.push(userId);
    if (room.userIdList.length === GAME_USER_COUNT) {
      room.status = RoomStatus.full;
    }
  }

  // 离开房间
  leaveRoom(userId: string, roomId: string): void {
    let socket = this.findSocket(userId);
    let user = this.findUser(userId);
    let room = this.findRoom(roomId);

    socket.leave(roomId);
    user.roomId = undefined;
    room.userIdList = room.userIdList.filter(id => id !== userId);
    room.status = RoomStatus.notFull;
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

  // 获取大厅信息
  getLobbyInfo(): IRoomInfo[] {
    return this.roomList.map(ro => {
      return this.getRoomInfo(ro);
    });
  }

  // 获取房间细节信息
  getRoomInfo(room: Room): IRoomInfo {
    return {
      id: room.id,
      name: room.name,
      status: room.status,
      userIdList: room.userIdList,
      gameId: room.gameId
    };
  }

  // 玩家准备
  userReady(userId: string): void {
    let user = this.findUser(userId);
    user.status = UserStatus.ready;

    // 尝试开启游戏
    if (this.canStartGame(user.roomId)) {
      this.startGame(user.roomId);
    }
  }
  // 玩家反准备
  userUnReady(userId: string): void {
    let user = this.findUser(userId);
    user.status = UserStatus.notReady;
  }

  // 是否房间可以开始游戏
  // 是否房间中的玩家已经满员,且都已经准备
  canStartGame(roomId: string): boolean {
    let room = this.findRoom(roomId);

    // 是否满员
    let isMatch = room.userIdList.length === GAME_USER_COUNT;
    if (!isMatch) {
      return false;
    }

    let isAllReady: boolean = room.userIdList.every(userId => {
      let user = this.findUser(userId);
      return user.status === UserStatus.ready;
    });
    if (!isAllReady) {
      return false;
    }

    return true;
  }

  // 开始游戏
  // 根据roomId找到gameId
  startGame(roomId) {
    let room = this.findRoom(roomId);
    let game = this.findGame(room.gameId);
    room.status = RoomStatus.play;
    // game.chBoard.start();
  }
}
let lobby = new Lobby();
export default lobby;
