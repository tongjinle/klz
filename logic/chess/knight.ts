import * as api from "../api";
import { SkillType } from "../types";
import Chess from "./chess";
import Storm from "../skill/storm";

// 骑士
export default class Knight extends Chess {
  energy = 2;

  hp = 10;
  maxhp = 10;

  getMoveRangeOnPurpose() {
    return api.rangeApi.nearRange(this.position, 1);
  }

  constructor() {
    super();

    this.addSkill(new Storm());
  }
}
