import * as api from "../api";
import { IPosition, SkillType } from "../types";
import Skill from "./skill";

// 碾压
export default class Crash extends Skill {
  type: SkillType = "crash";

  getCastRangeOnPurpose() {
    let owner = this.owner;

    let range = api.rangeApi.nearRange(owner.position, 1);

    range = range.filter(this.enemyFilter);

    return range;
  }

  cast(position: IPosition) {
    let damage = 3;
    let ch = this.owner.chessBoard.getChessByPosition(position);
    if (ch) {
      ch.setHp(ch.hp - damage);
    }
  }
}
