import {ChessRelationship, IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import Skill from './skill';
import * as api from '../api';
import _ = require('underscore');

export default class Cleave extends Skill {

	type = SkillType.cleave;

	getCastRangeOnPurpose() {
		let owner = this.owner;
		let chBoard = owner.chBoard;

		let range = api.rangeApi.nearRange(owner.posi, 1);

		range = _.filter(range, po => {
			return this.chessFilter(po, ChessRelationship.enemy);
		});

		return range;
	}


	effect(posi: IPosition) {
		let damage = 6;
		// 目标平行三格内敌人
		let range = api.rangeApi.nearRange(posi, 1);
		// 加上自己
		range = range.concat(posi);
		// 除去owner
		range = api.rangeApi.sub(range, [this.owner.posi]);
		// 除去垂直距离等于2的posi
		range = _.filter(range, po => {
			return Math.abs(po.x - this.owner.posi.x) != 2 &&
				Math.abs(po.y - this.owner.posi.y) != 2;
		});

		_.each(range, po => {
			let ch = this.owner.chBoard.getChessByPosi(po);
			if (ch) {
				api.chessApi.setHp(ch, ch.hp - damage);
			}
		});

	}




}