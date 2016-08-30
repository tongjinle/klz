/// <reference path="../../typings/index.d.ts" />
import {IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';

import _ = require("underscore");
import * as api from '../api';
import Chess from './chess';

export default class King extends Chess {

	hp = 18;
	energy = 3;

	getMoveRangeOnPurpose() {
		return api.rangeApi.nearRange(this.posi, 1);

	}
	constructor() {
		super();

		// 技能列表
		this.addSkill(api.skillApi.create(SkillType.cleave));
	}



}

