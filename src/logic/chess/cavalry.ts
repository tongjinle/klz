import Crash from "../skill/crash";
import Chess from "./chess";

// 骑兵
export default class Cavalry extends Chess {
  energy = 1;

  hp = 12;
  maxhp = 12;

  getMoveRangeOnPurpose() {
    return [
      { x: this.position.x - 2, y: this.position.y + 1 },
      { x: this.position.x - 2, y: this.position.y - 1 },
      { x: this.position.x + 2, y: this.position.y + 1 },
      { x: this.position.x + 2, y: this.position.y - 1 },
      { x: this.position.x + 1, y: this.position.y - 2 },
      { x: this.position.x - 1, y: this.position.y - 2 },
      { x: this.position.x + 1, y: this.position.y + 2 },
      { x: this.position.x - 1, y: this.position.y + 2 }
    ];
  }

  constructor() {
    super();
    this.addSkill(new Crash());
  }
}
