import * as api from "../api";
import { IPosition, SkillType } from "../types";
import Skill from "./skill";

// 挥击
// 攻击前方3个棋子
export default class Cleave extends Skill {
  type = SkillType.cleave;

  getCastRangeOnPurpose() {
    let owner = this.owner;

    let range = api.rangeApi.nearRange(owner.position, 1);

    range = range.filter(this.enemyFilter);

    return range;
  }

  cast(position: IPosition) {
    let damage = 6;
    // 目标平行三格内敌人
    let range = api.rangeApi.nearRange(position, 1);
    // 加上自己
    range = range.concat(position);
    // 除去owner
    range = api.rangeApi.sub(range, [this.owner.position]);
    // 除去垂直距离等于2的posi
    range = range.filter(po => {
      return (
        Math.abs(po.x - this.owner.position.x) != 2 &&
        Math.abs(po.y - this.owner.position.y) != 2
      );
    });

    range.forEach(po => {
      let ch = this.owner.chessBoard.getChessByPosition(po);
      if (ch) {
        api.chessApi.setHp(ch, ch.hp - damage);
      }
    });
  }
}
