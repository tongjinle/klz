import * as api from "../api";
import { IPosition, SkillType } from "../types";
import Skill from "./skill";

// 普通攻击
export default class Attack extends Skill {
  type = SkillType.attack;

  getCastRangeOnPurpose() {
    let owner = this.owner;

    let range = api.rangeApi.nearRange(owner.position, 1);
    range = range.filter(this.friendFilter);

    return range;
  }

  cast(position: IPosition): void {
    let damage = 1;
    let ch = this.owner.chessBoard.getChessByPosition(position);
    if (ch) {
      api.chessApi.setHp(ch, ch.hp - damage);
    }
  }
}
