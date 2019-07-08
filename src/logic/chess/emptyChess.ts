import Chess from "./chess";

// 步兵
export default class EmptyChess extends Chess {
  // 能量需求
  energy = 1;
  // 生命值
  hp = 1000;
  maxhp = 1000;

  // 获得可以移动的坐标列表
  getMoveRangeOnPurpose() {
    return [];
  }

  constructor() {
    super();
    // 技能列表
  }
}
