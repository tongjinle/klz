import * as api from "../api";
import { IPosition, SkillType } from "../types";
import Skill from "./skill";

// 对单个友军回复6点血量,施法距离为直线4格
export default class Heal extends Skill {
  type = SkillType.heal;

  getCastRangeOnPurpose() {
    let owner = this.owner;
    let chBoard = owner.chessBoard;

    let range = api.rangeApi.nearRange(owner.position, 4);

    range = range.filter(this.friendFilter).filter(po => {
      let ch = chBoard.getChessByPosition(po);
      return ch.hp < ch.maxhp;
    });

    return range;
  }

  cast(position: IPosition) {
    let heal = 6;
    let ch = this.owner.chessBoard.getChessByPosition(position);
    if (ch) {
      api.chessApi.setHp(ch, ch.hp + heal);
    }
  }
}
