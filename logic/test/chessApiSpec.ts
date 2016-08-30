/// <reference path="../../typings/index.d.ts" />
import {IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';
import _ = require('underscore');
import * as chessApi from '../chessApi';

describe('chess api', () => {

	let ch: IChess;
	beforeEach(() => {
		ch = chessApi.create(ChessType.footman);
	});

	it('create', () => {
		expect(ch.status).toBe(ChessStatus.rest);
	});

	it('position', () => {
		chessApi.setPosition(ch, { x: 1, y: 1 });
		expect(ch.posi.x).toBe(1);
		expect(ch.posi.x).toBe(1);
	});


});