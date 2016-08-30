import {ChessRelationship, IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';
import Skill from './skill';
import * as api from '../api';
import _ = require('underscore');

export default class Fire extends Skill {

	type = SkillType.fire;

	getCastRangeOnPurpose() {
		let owner = this.owner;
		let chBoard = owner.chBoard;

		let range = api.rangeApi.nearRange(owner.posi, 4)
			.concat(api.rangeApi.nearSlashRange(owner.posi, 3));


		range = _.filter(range, po => {
			return this.chessFilter(po, ChessRelationship.enemy);
		});

		range = _.filter(range,po=>{
			return this.inChessShadowFilter(this.owner.posi,po);
		});

		return range;
	}


	effect(posi: IPosition) {
		let damage = 8;
		let ch = this.owner.chBoard.getChessByPosi(posi);
		if (ch) {
			api.chessApi.setHp(ch, ch.hp - damage);
		}
	}




}