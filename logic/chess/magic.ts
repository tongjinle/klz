import * as api from "../api";
import Fire from "../skill/fire";
import Nova from "../skill/nova";
import { IPosition } from "../types";
import Chess from "./chess";

// 法师
export default class Magic extends Chess {
  hp = 8;
  maxhp = 8;
  energy = 4;

  getMoveRangeOnPurpose() {
    let range: IPosition[] = [
      ...api.rangeApi.nearRange(this.position, 4),
      ...api.rangeApi.nearSlashRange(this.position, 3)
    ];
    return range;
  }

  constructor() {
    super();

    // 技能列表
    this.addSkill(new Fire());
    this.addSkill(new Nova());
  }
}
