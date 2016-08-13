import  {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';

export default class Skill implements ISkill {
	id:number;
	type:SkillType;
	owner:IChess;
	getCastRange: () => IPosition[];
	maxcd: number;
	cd: number;
	cooldown: () => void;
	cast:(posiTarget:IPosition)=>void;

	protected effect: (posiTarget: IPosition) => void;

	
	constructor(){
		this.cast = (posi)=>{

		};
	}
}