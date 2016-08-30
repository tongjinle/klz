import {IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';
import Attack from './attack';
import Storm from './storm';
import Crash from './crash';
import Heal from './heal';
import Purge from './purge';
import Fire from './fire';
import Nova from './nova';
import Cleave from './cleave';

let skillList = {
	[SkillType.attack]: Attack,
	[SkillType.storm]:Storm,
	[SkillType.crash]:Crash,
	[SkillType.heal]:Heal,
	[SkillType.purge]:Purge,
	[SkillType.fire]:Fire,
	[SkillType.nova]:Nova,
	[SkillType.cleave]:Cleave
};

export default skillList;