/// <reference path="../../typings/index.d.ts" />
import {ChessBoardStatus, IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import _ = require('underscore');
import ChessBoard from '../chessBoard/chessBoard';
import * as api from '../api';
import Chess from '../chess/chess';
import ReplayMgr from '../replayMgr';


describe('chessBoard', () => {
	let chBoard: IChessBoard;

	beforeEach(() => {
		chBoard = new ChessBoard();
		chBoard.readMap('normal');
	});


	// 初始化普通地图
	it('init normal', () => {
		expect(chBoard.chessList.length).toEqual(32);
	});

	// 增加/删除选手
	it('add/remove player', () => {
		chBoard.addPlayer('jack');
		expect(_.find(chBoard.playerList, p => p.name == 'jack')).not.toBeUndefined();

		chBoard.addPlayer('tom');
		chBoard.addPlayer('lily');
		expect(_.find(chBoard.playerList, p => p.name == 'lily')).toBeUndefined();


		chBoard.removePlayer('jack');
		chBoard.addPlayer('lilei');
		let p: IPlayer = _.find(chBoard.playerList, p => p.name == 'lilei');
		expect(p.color).toBe(ChessColor.red);
	});

	// 选手准备,会自动开启游戏
	it('ready', () => {

		chBoard.addPlayer('jack');
		chBoard.addPlayer('tom');

		let jack = _.find(chBoard.playerList, p => p.name == 'jack');
		let tom = _.find(chBoard.playerList, p => p.name == 'tom');

		expect(chBoard.status).toBe(ChessBoardStatus.beforeStart);
		expect(jack.status).toBe(PlayerStatus.notReady);
		expect(tom.status).toBe(PlayerStatus.notReady);

		chBoard.ready('jack', PlayerStatus.ready);
		chBoard.ready('jack', PlayerStatus.notReady);
		chBoard.ready('tom', PlayerStatus.ready);
		expect(chBoard.status).toBe(ChessBoardStatus.beforeStart);

		chBoard.ready('jack', PlayerStatus.ready);
		expect(chBoard.status).toBe(ChessBoardStatus.red);
	});



});

describe('chessBoard basis', () => {
	let repMgr: ReplayMgr
	let chBoard: IChessBoard;
	let jack: IPlayer;
	let tom: IPlayer;

	beforeEach(() => {
		repMgr = new ReplayMgr();

		chBoard = repMgr.chBoard;
		chBoard.setMapSize(8, 8);

		chBoard.addPlayer('jack');
		chBoard.addPlayer('tom');

		// 选手准备
		chBoard.ready('jack', PlayerStatus.ready);
		chBoard.ready('tom', PlayerStatus.ready);

		jack = _.find(chBoard.playerList, p => p.name == 'jack');
		tom = _.find(chBoard.playerList, p => p.name == 'tom');
	});





	// 获取当前选手
	it('currPlayer', () => {
		chBoard.round('tom');
		expect(chBoard.currPlayer.name).toBe('tom');
	});


	// 获取当前选手的状态
	it('currPlayerStatus', () => {
		chBoard.round('jack');
		expect(jack.status).toBe(PlayerStatus.thinking);
		expect(jack.chStatus).toBe(ChessStatus.beforeChoose);
	});


	// 获取可以被选择的的棋子
	it('chessCanBeChoose', () => {

		let list = [
			{ id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
			{ id: 1, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red },
			{ id: 2, energy: 1, posi: { x: 1, y: 3 }, color: ChessColor.black },
			{ id: 3, energy: 5, posi: { x: 1, y: 4 }, color: ChessColor.red },

		];

		_.each(list, n => {
			let ch: IChess = new Chess();
			ch.id = n.id;
			ch.energy = n.energy;
			ch.posi = n.posi;
			ch.color = n.color;
			chBoard.addChess(ch);
		});


		// repMgr.parse({
		// 	action:"addChess",
		// 	data:{
		// 		chessType:ChessType.footman,
		// 		position:{x:11,y:1},
		// 		chessColor:ChessColor.red
		// 	}
		// });
		// repMgr.parse({
		// 	action:"addChess",
		// 	data:{
		// 		chessType:ChessType.footman,
		// 		position:{x:1,y:1},
		// 		chessColor:ChessColor.red
		// 	}
		// });
		// repMgr.parse({
		// 	action:"addChess",
		// 	data:{
		// 		chessType:ChessType.footman,
		// 		position:{x:1,y:1},
		// 		chessColor:ChessColor.red
		// 	}
		// });
		// repMgr.parse({
		// 	action:"addChess",
		// 	data:{
		// 		chessType:ChessType.footman,
		// 		position:{x:1,y:1},
		// 		chessColor:ChessColor.red
		// 	}
		// });

		jack.energy = 3;
		let activeChList = chBoard.getActiveChessList();
		expect(_.map(activeChList, ch => ch.id)).toEqual([0, 1])
	});

	// 选手选择棋子
	// 选择能被选择的
	it('chooseChess', () => {
		let list = [
			{ id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
			{ id: 1, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red },
			{ id: 2, energy: 1, posi: { x: 1, y: 3 }, color: ChessColor.black },
			{ id: 3, energy: 5, posi: { x: 1, y: 4 }, color: ChessColor.red },

		];

		_.each(list, n => {
			let ch: IChess = new Chess();
			ch.id = n.id;
			ch.energy = n.energy;
			ch.posi = n.posi;
			ch.color = n.color;
			chBoard.addChess(ch);
		});



		jack.energy = 3;
		let ch: IChess = _.find(chBoard.chessList, ch => ch.id == 0);
		chBoard.chooseChess(ch);
		expect(jack.chStatus).toBe(ChessStatus.beforeMove);
		// expect(ch.status).toBe(ChessStatus.beforeMove);
		// expect(chBoard.currChess).toBe(ch);

	});

	// 选择别人的棋子(应该出错)
	// 选不到会让当前的currChess成为undefined
	it('chooseChess(chess of enemy)', () => {

		let list = [
			{ id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.black }
		];

		_.each(list, n => {
			let ch: IChess = new Chess();
			ch.id = n.id;
			ch.energy = n.energy;
			ch.posi = n.posi;
			ch.color = n.color;
			chBoard.addChess(ch);
		});


		jack.energy = 3;
		let ch: IChess = _.find(chBoard.chessList, ch => ch.id == 0);
		chBoard.chooseChess(ch);
		expect(jack.chStatus).toBe(ChessStatus.beforeChoose);
		expect(ch.status).toBe(ChessStatus.beforeChoose);
		expect(chBoard.currChess).toBeUndefined();

	});

	// 选择energy不足的棋子(应该出错)
	it('chooseChess(out of energy)', () => {

		let list = [
			{ id: 0, energy: 5, posi: { x: 1, y: 1 }, color: ChessColor.red }

		];

		_.each(list, n => {
			let ch: IChess = new Chess();
			ch.id = n.id;
			ch.energy = n.energy;
			ch.posi = n.posi;
			ch.color = n.color;
			chBoard.addChess(ch);
		});


		jack.energy = 3;
		let ch: IChess = _.find(chBoard.chessList, ch => ch.id == 0);
		chBoard.chooseChess(ch);
		expect(jack.chStatus).toBe(ChessStatus.beforeChoose);
		expect(ch.status).toBe(ChessStatus.beforeChoose);
		expect(chBoard.currChess).toBeUndefined();

	});

	// 选手反选当前棋子
	it('unChooseChess', () => {

		let list= [
			{ id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red }
		];
		_.each(list, n => {
			let ch: IChess = new Chess();
			ch.id = n.id;
			ch.energy = n.energy;
			ch.posi = n.posi;
			ch.color = n.color;
			chBoard.addChess(ch);
		});

		jack.energy = 3;
		let ch: IChess = _.find(chBoard.chessList, ch => ch.id == 0);
		chBoard.chooseChess(ch);
		chBoard.unChooseChess(ch);
		expect(jack.chStatus).toBe(ChessStatus.beforeChoose);
		expect(ch.status).toBe(ChessStatus.beforeChoose);
		expect(chBoard.currChess).toBeUndefined();
	});



	// 选手移动棋子
	it('moveChess', () => {
		let list = [
			{ id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
			{ id: 1, energy: 1, posi: { x: 1, y: 4 }, color: ChessColor.black }

		];
		_.each(list, n => {
			let ch: IChess = new Chess();
			ch.id = n.id;
			ch.energy = n.energy;
			ch.posi = n.posi;
			ch.color = n.color;
			chBoard.addChess(ch);
		});




		let ch: IChess;
		// jack移动了棋子,然后没有攻击目标,自动进入休息
		jack.energy = 3;
		ch = _.find(chBoard.chessList, ch => ch.id == 0);
		chBoard.chooseChess(ch);
		chBoard.moveChess({ x: 1, y: 2 });
		expect(ch.posi).toEqual({x:1,y:2});

		expect(jack.status).toBe(PlayerStatus.waiting);
		// expect(jack.chStatus).toBe(ChessStatus.beforeChoose);
		// expect(ch.status).toBe(ChessStatus.beforeChoose);
		// expect(chBoard.currChess).toBeUndefined();

		// // tom移动了棋子,然后有攻击目标
		// tom.energy = 10;
		// ch = _.find(chBoard.chessList, ch => ch.id == 1);
		// chBoard.chooseChess(ch);
		// chBoard.moveChess({ x: 1, y: 3 });
		// expect(tom.status).toBe(PlayerStatus.thinking);
		// expect(tom.chStatus).toBe(ChessStatus.beforeCast);
		// expect(ch.status).toBe(ChessStatus.beforeCast);
		// expect(chBoard.currChess).not.toBeUndefined();

	});

	// 选手选择技能

	// 选手反选技能

	// 选手攻击棋子

	// 选手休息/选手的自动休息

	// 判断胜负

});