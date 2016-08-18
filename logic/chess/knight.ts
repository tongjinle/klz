/// <reference path="../../typings/index.d.ts" />
import {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';

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