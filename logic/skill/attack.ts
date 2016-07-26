import  {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import  Skill from './skill';

export default class Attack extends Skill {
	constructor(){
		super();

		this.type = SkillType.attack;
		this.maxcd = 0;
	}
}