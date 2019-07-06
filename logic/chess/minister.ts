import * as api from "../api";
import Heal from "../skill/heal";
import Purge from "../skill/purge";
import Chess from "./chess";

// 主教
export default class Minister extends Chess {
  energy = 3;
  hp = 8;
  maxhp = 8;

  getMoveRangeOnPurpose() {
    return api.rangeApi.nearRange(this.position, 1);
  }
  constructor() {
    super();

    this.addSkill(new Heal());
    this.addSkill(new Purge());
  }
}
