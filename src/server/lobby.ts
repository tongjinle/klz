import Room, { RoomStatus } from "./room";
import User, { UserStatus } from "./user";
import Game from "../logic/Game";
import { Socket } from "socket.io";
import { BaseResponse } from "./protocol";
import { BasePrivateKeyEncodingOptions } from "crypto";
import { genUniqueId } from "../logic/api";

export interface IRoomInfo {
  id: string;
  name: string;
  status: RoomStatus;
  userIdList: string[];
  gameId: string;
}

// 检测是不是用户合法
function checkUser(getUserIdParams: (...args) => string) {
  return function(target, methodName: string, descriptor: PropertyDescriptor) {
    let origin = target[methodName];
    target[methodName] = function(...args) {
      let userId = getUserIdParams(...args);
      let user = this.findUser(userId);
      if (!user) {
        return { code: -100, message: "没有该用户" };
      }
      return origin.apply(this, args);
    };
  };
}

// 检查是不是房间合法
function checkRoom(getRoomIdParams: (...args) => string) {
  return function(target, methodName: string, descriptor: PropertyDescriptor) {
    let origin = target[methodName];
    target[methodName] = function(...args) {
      let roomId = getRoomIdParams(...args);
      let room = this.findRoom(roomId);
      if (!room) {
        return { code: -101, message: "没有该房间" };
      }
      return origin.apply(this, args);
    };
  };
}

// 游戏需要的人数
const GAME_USER_COUNT = 2;
const ROOM_COUNT = 10;

class Lobby {
  private socketList: Socket[] = [];
  // 房间列表
  private roomList: Room[] = [];
  // 用户列表
  // private userList: User[] = [];
  public userList: User[] = [];
  // 游戏列表
  private gameList: Game[] = [];

  public id: string;
  constructor() {
    this.id = genUniqueId();
    // 系统生成房间
    this.createRoom(ROOM_COUNT);
    this.roomList.forEach(room => {
      this.createGame(room.id);
    });
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

  private createRoom(count: number): void {
    for (let i = 0; i < count; i++) {
      let name = `${i}号房间`;
      let room = new Room(name);
      this.roomList.push(room);
    }
  }

  private createGame(roomId: string): void {
    let room = this.findRoom(roomId);
    let game = new Game();
    room.gameId = game.id;
    this.gameList.push(game);
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
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    let user = this.findUser(userId);
    if (user) {
      this.userList = this.userList.filter(user => user.id !== userId);

      let roomId = user.roomId;
      let room = this.findRoom(roomId);
      if (room) {
        room.userIdList = room.userIdList.filter(id => id !== userId);
        room.status = RoomStatus.notFull;
      }
    }
  }

  // 能否加入房间
  @checkUser(function(...args) {
    return args[0];
  })
  @checkRoom(function(...args) {
    return args[1];
  })
  canEnterRoom(userId: string, roomId: string): BaseResponse {
    let rst: BaseResponse = { code: 0 };
    let user = lobby.findUser(userId);
    // 如果已经在房间了,就不能进入了
    if (user.roomId) {
      return { code: -1, message: "已经在房间了" };
    }

    let room = lobby.findRoom(roomId);
    if (room.userIdList.length === 2) {
      return { code: -2, message: "房间已经满员了" };
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

  // 能否离开房间
  @checkUser(function(...args) {
    return args[0];
  })
  @checkRoom(function(this: Lobby, ...args) {
    let user = this.findUser(args[0]);
    return user.roomId;
  })
  canLeaveRoom(userId: string): BaseResponse {
    let rst: BaseResponse = { code: 0 };

    let user = this.findUser(userId);
    let roomId = user.roomId;
    let room = this.findRoom(roomId);
    if (!room.userIdList.find(id => id === userId)) {
      return { code: -1, message: "房间中不存在该用户" };
    }

    return rst;
  }

  // 离开房间
  leaveRoom(userId: string): void {
    let socket = this.findSocket(userId);
    let user = this.findUser(userId);

    let roomId = user.roomId;
    let room = this.findRoom(roomId);

    socket.leave(roomId);
    user.roomId = undefined;
    room.userIdList = room.userIdList.filter(id => id !== userId);
    room.status = RoomStatus.notFull;
  }

  // 玩家能否准备
  @checkUser(function(...args) {
    return args[0];
  })
  @checkRoom(function(this: Lobby, ...args) {
    let user = this.findUser(args[0]);
    return user.roomId;
  })
  canUserReady(userId: string): BaseResponse {
    let rst: BaseResponse = { code: 0 };

    // 用户已经准备
    let user = this.findUser(userId);
    if (user.status === UserStatus.ready) {
      return { code: -1, message: "用户已经准备" };
    }

    let roomId = user.roomId;
    let room = this.findRoom(roomId);
    // 房间已经开始开始游戏
    if (room.status === RoomStatus.play) {
      return { code: -2, message: "房间已经开始游戏" };
    }

    return rst;
  }

  // 玩家准备
  userReady(userId: string): void {
    let user = this.findUser(userId);
    user.status = UserStatus.ready;
  }

  // 玩家能否反准备
  @checkUser(function(...args) {
    return args[0];
  })
  @checkRoom(function(this: Lobby, ...args) {
    let user = this.findUser(args[0]);
    return user.roomId;
  })
  canUserUnReady(userId: string): BaseResponse {
    let rst: BaseResponse = { code: 0 };
    // 用户尚未准备
    let user = this.findUser(userId);
    if (user.status === UserStatus.notReady) {
      return { code: -1, message: "用户尚未准备" };
    }

    let roomId = user.roomId;
    let room = this.findRoom(roomId);
    // 房间已经开始开始游戏
    if (room.status === RoomStatus.play) {
      return { code: -2, message: "房间已经开始游戏" };
    }

    return rst;
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
    if (!room) {
      return false;
    }

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
    game.chBoard.start();
  }
}
let lobby: Lobby;
if (!lobby) {
  lobby = new Lobby();
}
export default lobby;
