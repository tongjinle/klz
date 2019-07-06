import Chess from "./chess/chess";
import chessList from "./chess/chessList";
import ChessBoard from "./chessBoard/chessBoard";
import {
  ChessColor,
  ChessStatus,
  ChessType,
  IPosition,
  IRecord
} from "./types";
import { genUniqueId } from "./api";

// 创建棋子
export function create(type: ChessType): Chess {
  let ch: Chess = new chessList[type]();
  // id
  ch.id = genUniqueId();
  // type
  ch.type = type;
  // status
  ch.status = ChessStatus.rest;

  return ch;
}

// 设置颜色(阵营)
export function setColor(ch: Chess, color: ChessColor): void {
  ch.color = color;
}

// 设置位置
export function setPosition(ch: Chess, posi: IPosition): void {
  ch.position = ch.position || { x: -1, y: -1 };

  ch.position.x = posi.x;
  ch.position.y = posi.y;
}

export function setHp(ch: Chess, hp: number): void {
  ch.hp = hp < 0 ? 0 : hp > ch.maxhp ? ch.maxhp : hp;
}

// 找到可以行走的范围
export function getMoveRange(ch: Chess, chBoard: ChessBoard): IPosition[] {
  let posiList: IPosition[] = [];
  return posiList;
}

// 移动棋子
export function move(
  ch: Chess,
  chBoard: ChessBoard,
  posiTarget: IPosition
): IRecord {
  let re: IRecord;
  setPosition(ch, posiTarget);
  return re;
}

export function setStatus(ch: Chess, status: ChessStatus): void {
  ch.status = status;
  // todo
}
