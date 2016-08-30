/// <reference path="../../typings/index.d.ts" />
import {IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';

import _ = require("underscore");
import * as api from '../api';
import Chess from './chess';

export default class Footman extends Chess {
	// 能量需求
	energy = 1;

	// 生命值
	hp = 4;

	// 获得可以移动的坐标列表
	getMoveRangeOnPurpose() {
		let range = api.rangeApi.nearRange(this.posi, 1);

		return range;
	};



	constructor() {
		super();
		// 技能列表
		this.addSkill(api.skillApi.create(SkillType.attack));
	}



}

