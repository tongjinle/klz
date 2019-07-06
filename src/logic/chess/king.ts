import * as api from "../api";
import Cleave from "../skill/cleave";
import Chess from "./chess";

// 国王
export default class King extends Chess {
  hp = 18;
  maxhp = 18;
  energy = 3;

  getMoveRangeOnPurpose() {
    return api.rangeApi.nearRange(this.position, 1);
  }
  constructor() {
    super();
    // 技能列表
    this.addSkill(new Cleave());
  }
}
