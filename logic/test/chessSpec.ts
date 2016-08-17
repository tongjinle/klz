/// <reference path="../../typings/index.d.ts" />
import {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import _ = require('underscore');
import chessList from '../chess/chessList';
import skillList from '../skill/skillList';
import ChessBoard from '../chessBoard/chessBoard';

// 这里测试具体的skill

describe('skill detail',()=>{

	let chBoard:IChessBoard;


	beforeEach(()=>{
		chBoard = new ChessBoard();
		chBoard.setMapSize(8,8);
	});


	it('attack',()=>{
		let ft:IChess= new chessList[ChessType.footman]();
		let ft2:IChess =new chessList[ChessType.footman]();

		ft.posi={x:1,y:1};
		ft.color = ChessColor.red;
		ft2.posi={x:1,y:3};
		ft2.color = ChessColor.black;

		chBoard.addChess(ft);
		chBoard.addChess(ft2);

		let sk:ISkill = ft.skillList[0];

		// 超过attack的距离
		expect(sk.getCastRange().length).toBe(0);
	});
});
