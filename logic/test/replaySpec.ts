/// <reference path="../../typings/index.d.ts" />
import {ActionType, IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
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

	describe('write replay', () => {


		xit('setMapSeed', () => {
			chBoard.setMapSeed(100);

			expect(_.find(recoList, (reco) => reco.action == ActionType.setMapSeed && reco.data.seed == 100)).toBeTruthy();

		});
		xit('setMapSize', () => {
			chBoard.setMapSize(80, 80);
			let reco = _.find(recoList, reco => reco.action == ActionType.setMapSize);
			expect(reco.data.width).toBe(80);
			expect(reco.data.height).toBe(80);
		});
		xit('setMapChess', () => {
			chBoard.setMapSize(8, 8);
			let chList = [
				{ color: ChessColor.red, chType: ChessType.footman, posi: { x: 1, y: 1 } },
				{ color: ChessColor.black, chType: ChessType.king, posi: { x: 1, y: 2 } },
			];
			chBoard.setMapChess(chList);

			let list: IRecord[];
			list = _.filter(recoList, reco => reco.action == ActionType.addChess);
			expect(list.length).toBe(2);

		});

		describe('rep basis', () => {
			let jack:IPlayer;
			let tom:IPlayer;

			beforeEach(()=>{
				chBoard.readMap('normal');
				chBoard.addPlayer('jack');
				chBoard.addPlayer('tom');
				chBoard.ready('jack',PlayerStatus.ready);
				chBoard.ready('tom',PlayerStatus.ready);
			});

			xit('round', () => {
				let recoList = rep.query(ActionType.round , {round:1});
				expect(recoList.length).toBe(1);
				expect(recoList[0].data.playerName).toBe('jack');
				expect(recoList[0].data.energy).toBe(7);
			});

			xit('addChess', () => {
				let ch = Chess.createChessByType(ChessType.footman);
				ch.posi = {x:4,y:4};
				ch.color = ChessColor.red;
				chBoard.addChess(ch);

				let recoList:IRecord[] = rep.query(ActionType.addChess,undefined);
				expect(recoList.length).toBe(1);
				expect(recoList[0].action).toBe(ActionType.addChess);
			});
			xit('removeChess', () => { });
			xit('selectChess', () => { });
			xit('moveChess', () => { });
			xit('selectSkill', () => { });
			xit('castSkill', () => { });
			xit('rest', () => { });
			xit('chess', () => { });
			xit('skill', () => { });
			xit('rest', () => { });
		});

	});

	it('read replay', () => {

	});

});