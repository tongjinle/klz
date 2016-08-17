import  {ChessRelationship, IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import  Skill from './skill';
import * as api from '../api';

export default class Purge extends Skill {

	type = SkillType.purge;

	getCastRangeOnPurpose(){
		let owner = this.owner;
		let chBoard = owner.chBoard;

		let range = api.rangeApi.nearRange(owner.posi, 3);
		
		// 寻找敌人
		range = _.filter(range, po => {
			return this.chessFilter(po,ChessRelationship.enemy);
		});

		// 考虑视野遮挡
		range = _.filter(range,po=>{
			return this.inChessShadowFilter(owner.posi,po);
		});

		return range;
	}


	effect(posi:IPosition){
		let range = api.rangeApi.getBetween(this.owner.posi,posi);
		range = range.concat(posi);
		range = _.filter(range,po=>{
			return this.chessFilter(po,ChessRelationship.enemy);
		});

		let damage = 2;
		_.each(range,po=>{
			let ch = this.owner.chBoard.getChessByPosi(posi);
			if(ch){
				api.chessApi.setHp(ch,ch.hp-damage);
			}
		});
	}


	

}