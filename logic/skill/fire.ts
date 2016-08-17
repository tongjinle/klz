import {ChessRelationship, IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import Skill from './skill';
import * as api from '../api';

export default class Fire extends Skill {

	type = SkillType.fire;

	getCastRangeOnPurpose() {
		let owner = this.owner;
		let chBoard = owner.chBoard;

		let range = api.rangeApi.nearRange(owner.posi, 4)
			.concat(api.rangeApi.nearSlashRange(owner.posi, 3));

		api.rangeApi.unique(range);

		range = _.filter(range, po => {
			return this.chessFilter(po, ChessRelationship.enemy);
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