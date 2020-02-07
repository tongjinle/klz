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
  ["attack"]: Attack,
  ["storm"]: Storm,
  ["crash"]: Crash,
  ["heal"]: Heal,
  ["purge"]: Purge,
  ["fire"]: Fire,
  ["nova"]: Nova,
  ["cleave"]: Cleave
};

export default skillList;
