/// <reference path="../../typings/index.d.ts" />
import  {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';

import _ = require("underscore");
import * as api from '../api';
import Chess from './chess';

export default class Minister extends Chess {
	energy =3;
	hp=8;

	getMoveRangeOnPurpose(){
		return api.rangeApi.nearRange(this.posi, 1);
	}
	constructor() {
		super();

		this.addSkill(api.skillApi.create(SkillType.heal));
		this.addSkill(api.skillApi.create(SkillType.purge));
	}



}

