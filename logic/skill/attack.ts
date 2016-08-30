import  {IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';
import  Skill from './skill';
import * as api from '../api';
import _ = require('underscore');

export default class Attack extends Skill {

	type = SkillType.attack;

	getCastRangeOnPurpose(){
		let owner = this.owner;
		let chBoard = owner.chBoard;

		let range = api.rangeApi.nearRange(owner.posi, 1);
		
		range = _.filter(range, po => {
			let ch = chBoard.getChessByPosi(po);
			return ch && ch.color != owner.color;
		});

		return range;
	}


	effect(posi:IPosition){
		let damage = 1;
		let ch = this.owner.chBoard.getChessByPosi(posi);
		if(ch){
			api.chessApi.setHp(ch,ch.hp-damage);
		}
	}


	

}