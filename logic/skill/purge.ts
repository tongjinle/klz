import  {ChessRelationship, IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';
import  Skill from './skill';
import * as api from '../api';
import _ =  require('underscore');

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
			let ch = this.owner.chBoard.getChessByPosi(po);
			if(ch){
				api.chessApi.setHp(ch,ch.hp-damage);
			}
		});
	}


	

}