import * as api from "../api";
import { IPosition, SkillType } from "../types";
import Skill from "./skill";

// 火球术
export default class Fire extends Skill {
  type = SkillType.fire;

  getCastRangeOnPurpose() {
    let owner = this.owner;

    let range = [
      ...api.rangeApi.nearRange(owner.position, 4),
      ...api.rangeApi.nearSlashRange(owner.position, 3)
    ];

    range = range.filter(this.enemyFilter).filter(po => {
      return this.inChessShadowFilter(this.owner.position, po);
    });

    return range;
  }

  cast(position: IPosition) {
    let damage = 8;
    let ch = this.owner.chessBoard.getChessByPosition(position);
    if (ch) {
      api.chessApi.setHp(ch, ch.hp - damage);
    }
  }
}
