import  {ChessRelationship, IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import  Skill from './skill';
import * as api from '../api';

export default class Nova extends Skill {

	type = SkillType.nova;

	getCastRangeOnPurpose(){
		let owner = this.owner;
		let chBoard = owner.chBoard;

		let range = api.rangeApi.circleRange(owner.posi, 2);

		// 如果周围2格有敌人,可以使用
		range = _.filter(range, po => {
			return this.chessFilter(po,ChessRelationship.enemy);
		});

		if(range.length>0){
			return [owner.posi];
		}else{
			return [];
		}
	}


	effect(posi:IPosition){
		let damage = 6;
		let range = api.rangeApi.circleRange(this.owner.posi, 2);
		range = _.filter(range, po => {
			return this.chessFilter(po,ChessRelationship.enemy);
		});
		_.each(range,po=>{
			let ch = this.owner.chBoard.getChessByPosi(po);
			if(ch){
				api.chessApi.setHp(ch,ch.hp-damage);
			}
			
		});
	}


	

}