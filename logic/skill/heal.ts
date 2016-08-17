import {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import Skill from './skill';
import * as api from '../api';

// 对单个友军回复6点血量,施法距离为直线4格
export default class Heal extends Skill {

	type = SkillType.heal;

	getCastRangeOnPurpose() {
		let owner = this.owner;
		let chBoard = owner.chBoard;

		let range = api.rangeApi.nearRange(owner.posi, 4);

		range = _.filter(range, po => {
			let ch = chBoard.getChessByPosi(po);
			return ch && ch.color == owner.color;
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