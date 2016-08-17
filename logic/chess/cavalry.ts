/// <reference path="../../typings/index.d.ts" />
import {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';

import _ = require("underscore");
import * as api from '../api';
import Chess from './chess';


export default class Cavalry extends Chess {

	energy = 1;

	hp =12;

	getMoveRangeOnPurpose() {
		return [
			{ x: this.posi.x - 2, y: this.posi.y + 1 },
			{ x: this.posi.x - 2, y: this.posi.y - 1 },
			{ x: this.posi.x + 2, y: this.posi.y + 1 },
			{ x: this.posi.x + 2, y: this.posi.y - 1 },
			{ x: this.posi.x + 1, y: this.posi.y - 2 },
			{ x: this.posi.x - 1, y: this.posi.y - 2 },
			{ x: this.posi.x + 1, y: this.posi.y + 2 },
			{ x: this.posi.x - 1, y: this.posi.y + 2 }
		];
	};

	skillList = [
		api.skillApi.create(SkillType.crash)
	];


}