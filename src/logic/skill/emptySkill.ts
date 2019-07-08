import * as api from "../api";
import { IPosition, SkillType } from "../types";
import Skill from "./skill";

// 普通攻击
export default class EmptySkill extends Skill {
  type = SkillType.emptySkill;

  getCastRangeOnPurpose() {
    return [];
  }

  cast(position: IPosition): void {}
}
