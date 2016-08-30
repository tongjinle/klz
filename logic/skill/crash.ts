import  {IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';
import  Skill from './skill';
import * as api from '../api';

export default class Crash extends Skill {

	type = SkillType.crash;

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
		let damage = 3;
		let ch = this.owner.chBoard.getChessByPosi(posi);
		if(ch){
			api.chessApi.setHp(ch,ch.hp-damage);
		}
	}


	

}