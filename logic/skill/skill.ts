import  {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';

export default class Skill implements ISkill {
	id:number;
	type:SkillType;
	owner:IChess;
	getCastRange: () => IPosition[];
	effect: (posiTarget: IPosition) => void;
	maxcd: number;
	cd: number;
	cooldown: () => void;

	constructor(){

	}
}