import { ChessColor, ChessStatus, IPlayerInfo, PlayerStatus } from "../types";

export default class Player {
  name: string;
  color: ChessColor;
  status: PlayerStatus;
  /**是否在回合中直接选择休息 */
  isChooseRest: boolean;
  energy: number;

  toString(): IPlayerInfo {
    let info: IPlayerInfo = {} as IPlayerInfo;
    info.name = this.name;
    info.color = this.color;
    info.status = this.status;
    info.isChooseRest = this.isChooseRest;
    info.energy = this.energy;
    return info;
  }

  parse(info: IPlayerInfo): void {
    this.name = info.name;
    this.color = info.color;
    this.status = info.status;
    this.isChooseRest = info.isChooseRest;
    this.energy = info.energy;
  }
}
