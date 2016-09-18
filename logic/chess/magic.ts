/// <reference path="../../typings/index.d.ts" />
import {IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';

import _ = require("underscore");
import * as api from '../api';
import Chess from './chess';

export default class Magic extends Chess {

	hp = 8;
	maxhp = 8;
	energy = 4;

	getMoveRangeOnPurpose() {
		let range: IPosition[] = [];
		range = range.concat(api.rangeApi.nearRange(this.posi, 4));
		range = range.concat(api.rangeApi.nearSlashRange(this.posi, 3));
		return range;
	}


	constructor() {
		super();

		// 技能列表
		this.addSkill(api.skillApi.create(SkillType.fire));
		this.addSkill(api.skillApi.create(SkillType.nova));

	}



}

