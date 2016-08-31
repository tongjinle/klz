/// <reference path="../../typings/index.d.ts" />
import {ChessBoardStatus, ActionType, IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';
import _ = require('underscore');
import chessList from '../chess/chessList';
import skillList from '../skill/skillList';
import ChessBoard from '../chessBoard/chessBoard';
import Chess from '../chess/chess';
import Replay from '../replay';




describe('replay', () => {
	let rep: Replay;
	let recoList: IRecord[];
	let chBoard: ChessBoard;
	let red: IPlayer;
	let black: IPlayer;

	beforeEach(() => {
		chBoard = new ChessBoard();
		rep = chBoard.rep;
		recoList = rep.recoList;
	});




	it('setMapSeed', () => {
		chBoard.setMapSeed(100);
		let reco = rep.queryByActionType(ActionType.setMapSeed).queryByParams({ seed: 100 }).toList()[0];
		expect(reco).toBeTruthy();

	});

	it('setMapSize', () => {
		chBoard.setMapSize(80, 80);
		// let reco = _.find(recoList, reco => reco.action == ActionType.setMapSize);
		let reco = rep.queryByActionType(ActionType.setMapSize).toList()[0];
		expect(reco.data.width).toBe(80);
		expect(reco.data.height).toBe(80);
	});

	it('setMapChess', () => {
		chBoard.setMapSize(8, 8);
		let chList = [
			{ color: ChessColor.red, chType: ChessType.footman, posi: { x: 1, y: 1 } },
			{ color: ChessColor.black, chType: ChessType.king, posi: { x: 1, y: 2 } },
		];
		chBoard.setMapChess(chList);

		let list: IRecord[];
		list = rep.queryByActionType(ActionType.addChess).toList();
		expect(list.length).toBe(2);
		expect(list[0].data).toEqual({
			chessType: ChessType.footman,
			position: { x: 1, y: 1 },
			chessColor: ChessColor.red
		});

	});




});



describe('write replay - rep basis', () => {
	let rep: Replay;
	let recoList: IRecord[];
	let chBoard: ChessBoard;
	let red: IPlayer;
	let black: IPlayer;

	beforeAll(() => {
		chBoard = new ChessBoard();
		rep = chBoard.rep;

		// console.log(rep.recoList);

		chBoard.addPlayer('jack');
		chBoard.addPlayer('tom');
		

		
	});

	it('add player',()=>{
		chBoard.ready('jack', PlayerStatus.ready);
		chBoard.ready('tom', PlayerStatus.ready);
		expect(rep.queryByActionType(ActionType.addPlayer).toList().length).toBe(1);

		red = chBoard.getPlayerByName('jack');
		black = chBoard.getPlayerByName('tom');

	});


	it('addChess', () => {
		chBoard.readMap('normal');

		let recoList: IRecord[] = rep.queryByActionType(ActionType.addChess)
			.queryByParams({
				chessColor: ChessColor.red,
				position: { x: 0, y: 1 }
			})
			.toList();



		expect(recoList[0]).toBeTruthy();
		expect(recoList[0].data.position).toEqual({ x: 0, y: 1 });
	});

	// xit('round', () => {
	// 	let recoList = rep.queryByRound(1).toList();
	// 	expect(recoList.length).toBe(1);
	// 	expect(recoList[0].data.playerName).toBe('jack');
	// 	expect(recoList[0].data.energy).toBe(7);
	// });

	// 
	// xit('removeChess', () => {
	// 	let ch = Chess.createChessByType(ChessType.footman);
	// 	ch.posi = { x: 4, y: 4 };
	// 	ch.color = ChessColor.red;
	// 	chBoard.addChess(ch);
	// 	chBoard.removeChess(ch);

	// 	let recoList: IRecord[] = rep.queryByActionType(ActionType.removeChess).toList();
	// 	expect(recoList[0].action).toEqual({
	// 		round: 1,
	// 		action: ActionType.removeChess,
	// 		data: {
	// 			position: { x: 4, y: 4 }
	// 		}
	// 	});


	// });

	// 选择棋子,然后又反选了,不认为是一个选择棋子的记录
	// 只有在棋子"行动"之后,才承认这次选择

	it('chooseChess', () => {
		let ch = chBoard.getChessByPosi({ x: 0, y: 1 });
		chBoard.chooseChess(ch);
		expect(rep.queryByActionType(ActionType.chooseChess).toList().length).toBe(0);



	});

	it('moveChess', () => {
		chBoard.moveChess({ x: 0, y: 2 });
		expect(rep.queryByActionType(ActionType.chooseChess).toList().length).toBe(1);

		let moveReco = rep.queryByRound(1).queryByActionType(ActionType.moveChess).toList()[0];
		expect(moveReco.round).toBe(1);
		expect(moveReco.data.position).toEqual({ x: 0, y: 2 });


	});



	// 这个时候round转到了tom
	// tom选择(4,7)的magic移动到(4,3),使用fire技能,攻击jack在(4,1)的footman,造成footman死亡
	// 临时把tom的energy的energy提高,为了行动"magic"棋子
	it('chooseSkill', () => {
		black.energy = 10;

		let ch = chBoard.getChessByPosi({ x: 4, y: 7 });
		chBoard.chooseChess(ch);
		chBoard.moveChess({ x: 4, y: 3 });
		chBoard.chooseSkill(SkillType.fire);
		expect(rep.queryByActionType(ActionType.chooseSkill).toList().length).toBe(0);
	});


	// 选择技能,然后又反选了,不认为是一个选择技能的记录
	// 只有在技能"使用"之后,才承认这次选择
	it('castSkill', () => {
		chBoard.chooseSkillTarget({ x: 4, y: 1 });
		let reco = rep.queryByRound(2).queryByActionType(ActionType.chooseSkill).toList()[0];
		expect(reco.data.skillType).toEqual(SkillType.fire);

	});


	// jack's round
	// jack 主动休息
	it('rest', () => {
		chBoard.rest();
		expect(rep.queryByRound(3).queryByActionType(ActionType.rest).toList().length).toBe(1);
	});

	afterAll(() => {
		// console.log(JSON.stringify(rep.recoList));
	});

});









describe('read replay', () => {
	let recoList = [
		{"round":0,"action":12,"data":{"red": 'jack', "black": 'tom'}},
		{"round":0,"action":0,"data":{"seed":1216}},
		{"round":0,"action":1,"data":{"width":8,"height":8}},
		{"round":0,"action":4,"data":{"chessType":1,"position":{"x":0,"y":0},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":2,"position":{"x":1,"y":0},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":3,"position":{"x":2,"y":0},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":4,"position":{"x":3,"y":0},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":5,"position":{"x":4,"y":0},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":3,"position":{"x":5,"y":0},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":2,"position":{"x":6,"y":0},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":1,"position":{"x":7,"y":0},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":0,"y":1},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":1,"y":1},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":2,"y":1},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":3,"y":1},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":4,"y":1},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":5,"y":1},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":6,"y":1},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":7,"y":1},"chessColor":0}},
		{"round":0,"action":4,"data":{"chessType":1,"position":{"x":0,"y":7},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":2,"position":{"x":1,"y":7},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":3,"position":{"x":2,"y":7},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":5,"position":{"x":3,"y":7},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":4,"position":{"x":4,"y":7},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":3,"position":{"x":5,"y":7},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":2,"position":{"x":6,"y":7},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":1,"position":{"x":7,"y":7},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":0,"y":6},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":1,"y":6},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":2,"y":6},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":3,"y":6},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":4,"y":6},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":5,"y":6},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":6,"y":6},"chessColor":1}},
		{"round":0,"action":4,"data":{"chessType":0,"position":{"x":7,"y":6},"chessColor":1}},
		{"round":1,"action":6,"data":{"position":{"x":0,"y":1}}},
		{"round":1,"action":7,"data":{"position":{"x":0,"y":2}}},
		{"round":2,"action":6,"data":{"position":{"x":4,"y":7}}},
		{"round":2,"action":7,"data":{"position":{"x":4,"y":3}}},
		{"round":2,"action":8,"data":{"skillType":5}},
		{"round":2,"action":9,"data":{"position":{"x":4,"y":1}}},
		{"round":3,"action":10}];

	let rep:Replay;
	let chBoard:IChessBoard;

	beforeAll(()=>{
		rep = new Replay();
	});

	it('addPlayer',()=>{
		rep.parse(recoList[0] as IRecord);

		chBoard = rep.chBoard;

		expect(chBoard.playerList.length).toBe(2);
		expect(chBoard.status).toBe(ChessBoardStatus.red);
	});

	it('setMapSeed',()=>{
		rep.parse(recoList[1] as IRecord);
		expect(chBoard.seed).toBe(1216);
	});

	it('setMapSize',()=>{
		rep.parse(recoList[2] as IRecord);
		expect(chBoard.width).toBe(8);
		expect(chBoard.height).toBe(8);
	});

	it('addChess',()=>{
		recoList.slice(3,3+32).forEach(reco=>{
			rep.parse(reco as IRecord);
		});
		expect(chBoard.chessList.length).toBe(32);
	});

	it('red choose chess',()=>{
		rep.parse(recoList[35] as IRecord);
		expect(chBoard.currChess.posi).toEqual({x:0,y:1});
	});

	it('red move chess',()=>{
		let ch = chBoard.currChess;

		rep.parse(recoList[36] as IRecord);
		expect(ch.posi).toEqual({x:0,y:2});
	});

	it('black choose chess(magic)',()=>{
		expect(chBoard.currPlayer.color).toBe(ChessColor.black);

		// mock tom's energy to choose magic
		chBoard.currPlayer.energy=100;

		rep.parse(recoList[37] as IRecord);
		expect(chBoard.currChess.type).toBe(ChessType.magic);
	});

	it('black move chess',()=>{
		rep.parse(recoList[38] as IRecord);
		expect(chBoard.currChess.posi).toEqual({x:4,y:3});
	});

	it('black cast skill',()=>{
		let ch = chBoard.currChess;

		rep.parse(recoList[39] as IRecord);
		rep.parse(recoList[40] as IRecord);
		expect(chBoard.getChessByPosi({x:4,y:1})).toBeUndefined();
		expect(ch.status).toBe(ChessStatus.rest);
	});

	it('red rest',()=>{
		rep.parse(recoList[41] as IRecord);
		let red = _.find(chBoard.playerList,p=>p.color==ChessColor.red);
		let black = _.find(chBoard.playerList,p=>p.color==ChessColor.black);
		expect(red.energy).toBe(8);
	});


});







