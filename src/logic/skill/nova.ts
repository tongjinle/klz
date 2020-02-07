import * as api from "../api";
import { IPosition, SkillType } from "../types";
import Skill from "./skill";

export default class Nova extends Skill {
  type: SkillType = "nova";

  getCastRangeOnPurpose() {
    let owner = this.owner;
    let chBoard = owner.chessBoard;

    let range = api.rangeApi.circleRange(owner.position, 2);

    // 如果周围2格有敌人,可以使用
    range = range.filter(this.enemyFilter);

    if (range.length > 0) {
      return [owner.position];
    } else {
      return [];
    }
  }

  cast(position: IPosition) {
    let damage = 6;
    let range = api.rangeApi.circleRange(this.owner.position, 2);
    range = range.filter(this.enemyFilter);
    range.forEach(po => {
      let ch = this.owner.chessBoard.getChessByPosition(po);
      if (ch) {
        ch.setHp(ch.hp - damage);
      }
    });
  }
}
