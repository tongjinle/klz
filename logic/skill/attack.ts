import  {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import  Skill from './skill';
import * as api from '../api';

export default class Attack extends Skill {

	effect(posi:IPosition){
		let damage = 1;
		let ch = this.owner.chBoard.getChessByPosi(posi);
		if(ch){
			api.chessApi.setHp(ch,ch.hp-damage);
		}
	}


	constructor(){
		super();

		this.type = SkillType.attack;
		this.maxcd = 0;
	}

}