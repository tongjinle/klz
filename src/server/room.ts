import { genUniqueId } from "../logic/api";
import User from "./user";

// 房间状态
export enum RoomStatus {
  // 未满员
  notFull = "notFull",
  // 满员
  full = "full",
  // 游戏中
  play = "play",
  // 游戏结束
  gameover = "gameover"
}

export default class Room {
  id: string;
  name: string;
  status: RoomStatus;
  userIdList: string[];
  gameId: string;

  constructor(name: string) {
    this.id = genUniqueId();
    this.name = name;
    this.status = RoomStatus.notFull;
    this.userIdList = [];
  }
}
