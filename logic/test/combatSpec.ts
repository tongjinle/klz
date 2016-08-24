// combat记录了玩家在操作之后的effect
// effect被记录在表中,以供特殊的skill或者buff进行查询
// karazhan里没有,所以简单


/// <reference path="../../typings/index.d.ts" />
import {ChessBoardStatus, ActionType, IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import _ = require('underscore');
import ChessBoard from '../chessBoard/chessBoard';
import Chess from '../chess/chess';

describe('combat', () => {
	let chBoard: IChessBoard;

	beforeAll(()=>{
		chBoard = new ChessBoard();
	});


	xit('readMap',()=>{
		
		chBoard.readMap('normal');


	});

});


