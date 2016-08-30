import {IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';
import Skill from './skill';
import * as api from '../api';
import _ = require('underscore');

// 对单个友军回复6点血量,施法距离为直线4格
export default class Heal extends Skill {

	type = SkillType.heal;

	getCastRangeOnPurpose() {
		let owner = this.owner;
		let chBoard = owner.chBoard;

		let range = api.rangeApi.nearRange(owner.posi, 4);

		range = _.filter(range, po => {
			let ch = chBoard.getChessByPosi(po);
			return ch && ch.color == owner.color && ch.hp < ch.maxhp;
		});

		return range;
	}


	effect(posi: IPosition) {
		let heal = 6;
		let ch = this.owner.chBoard.getChessByPosi(posi);
		if (ch) {
			api.chessApi.setHp(ch, ch.hp + heal);
		}
	}




}