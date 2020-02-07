import * as api from "../api";
import { IPosition, SkillType } from "../types";
import Skill from "./skill";

// 暴风雪
export default class Storm extends Skill {
  type: SkillType = "storm";

  getCastRangeOnPurpose() {
    let owner = this.owner;

    let range = api.rangeApi.nearRange(owner.position, 1);

    range = range.filter(this.enemyFilter);

    if (range.length) {
      return [this.owner.position];
    }
    return [];
  }

  cast(position: IPosition) {
    let damage = 3;
    let range = api.rangeApi.circleRange(this.owner.position, 1);
    range.forEach(po => {
      let ch = this.owner.chessBoard.getChessByPosition(po);
      if (ch) {
        ch.setHp(ch.hp - damage);
      }
    });
  }
}
