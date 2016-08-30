/// <reference path="../../typings/index.d.ts" />
import {IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';

import * as api from '../api';
import Chess from './chess';

export default class Knight extends Chess {
	energy = 2;

	hp = 10;

	getMoveRangeOnPurpose(){
		return api.rangeApi.nearRange(this.posi,1);
	}



	constructor() {
		super();

		this.addSkill(api.skillApi.create(SkillType.storm));
	}



}