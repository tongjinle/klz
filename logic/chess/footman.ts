import * as api from "../api";
import Attack from "../skill/attack";
import Chess from "./chess";

// 步兵
export default class Footman extends Chess {
  // 能量需求
  energy = 1;
  // 生命值
  hp = 4;
  maxhp = 4;

  // 获得可以移动的坐标列表
  getMoveRangeOnPurpose() {
    let range = api.rangeApi.nearRange(this.position, 1);
    return range;
  }

  constructor() {
    super();
    // 技能列表
    this.addSkill(new Attack());
  }
}
