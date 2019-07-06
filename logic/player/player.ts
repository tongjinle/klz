import {
  IPlayerInfo,
  IPlayer,
  ChessColor,
  PlayerStatus,
  ChessStatus
} from "../types";

export default class Player implements IPlayer {
  name: string;
  color: ChessColor;
  status: PlayerStatus;
  chessStatus: ChessStatus;
  energy: number;

  toString(): IPlayerInfo {
    let info: IPlayerInfo = {} as IPlayerInfo;
    info.name = this.name;
    info.color = this.color;
    info.status = this.status;
    info.chStatus = this.chessStatus;
    info.energy = this.energy;
    return info;
  }

  parse(info: IPlayerInfo): void {
    this.name = info.name;
    this.color = info.color;
    this.status = info.status;
    this.chessStatus = info.chStatus;
    this.energy = info.energy;
  }
}
