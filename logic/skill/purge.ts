import * as api from "../api";
import { IPosition, SkillType } from "../types";
import Skill from "./skill";

// 净化
export default class Purge extends Skill {
  type = SkillType.purge;

  getCastRangeOnPurpose() {
    let owner = this.owner;

    let range = api.rangeApi.nearRange(owner.position, 3);

    // 寻找敌人
    range = range.filter(this.enemyFilter);

    return range;
  }

  cast(position: IPosition) {
    let range = api.rangeApi.getBetween(this.owner.position, position);
    range = range.concat(position);
    range = range.filter(this.enemyFilter);

    let damage = 2;
    range.forEach(po => {
      let ch = this.owner.chessBoard.getChessByPosition(po);
      if (ch) {
        api.chessApi.setHp(ch, ch.hp - damage);
      }
    });
  }
}
