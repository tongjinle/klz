import { SkillType } from "../types";
import Attack from "./attack";
import Cleave from "./cleave";
import Crash from "./crash";
import Fire from "./fire";
import Heal from "./heal";
import Nova from "./nova";
import Purge from "./purge";
import Storm from "./storm";

let skillList = {
  [SkillType.attack]: Attack,
  [SkillType.storm]: Storm,
  [SkillType.crash]: Crash,
  [SkillType.heal]: Heal,
  [SkillType.purge]: Purge,
  [SkillType.fire]: Fire,
  [SkillType.nova]: Nova,
  [SkillType.cleave]: Cleave
};

export default skillList;
