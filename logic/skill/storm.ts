/// <reference path="../../typings/index.d.ts" />

import {ChessRelationship, IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import Skill from './skill';
import * as api from '../api';
import _ = require('underscore');

export default class Storm extends Skill {

	type = SkillType.storm;

	getCastRangeOnPurpose() {
		let owner = this.owner;
		let chBoard = owner.chBoard;

		let range = api.rangeApi.nearRange(owner.posi, 1);

		range = _.filter(range, po => {
			return this.chessFilter(po,ChessRelationship.enemy);
		});

		if(range.length){
			return [this.owner.posi];
		}
		return [];
	}


	effect(posi: IPosition) {
		let damage = 3;
		let range = api.rangeApi.circleRange(this.owner.posi, 1);
		_.each(range, po => {
			let ch = this.owner.chBoard.getChessByPosi(po);
			if (ch) {
				api.chessApi.setHp(ch, ch.hp - damage);
			}
		});
	}




}