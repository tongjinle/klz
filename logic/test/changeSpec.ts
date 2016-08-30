// combat记录了玩家在操作之后的effect
// effect被记录在表中,以供特殊的skill或者buff进行查询
// karazhan里没有,所以简单


/// <reference path="../../typings/index.d.ts" />
import {RestType, ChangeType, IPositionChange, IHpChange, IEnergyChange, ChessBoardStatus, ActionType, IPosition, IBox, IChessBoard, IChess, ISkill,  IRecord, IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';
import * as _ from 'underscore';
import ChessBoard from '../chessBoard/chessBoard';
import Chess from '../chess/chess';

describe('combat', () => {
	let chBoard: IChessBoard;

	beforeAll(() => {
		chBoard = new ChessBoard();
		chBoard.readMap('normal');

		chBoard.addPlayer('cat');
		chBoard.addPlayer('mouse');
		chBoard.ready('cat', PlayerStatus.ready);
		chBoard.ready('mouse', PlayerStatus.ready);

		// 开始游戏...
	});


	xit('cat move chess', () => {
		let ch = chBoard.getChessByPosi({ x: 1, y: 0 });
		chBoard.chooseChess(ch);
		chBoard.moveChess({ x: 2, y: 2 });

		let chg: IPositionChange = _.find(chBoard.chgList, chg => chg.round == 0 && chg.type == ChangeType.position) as IPositionChange;

		expect(chg.detail. abs).toEqual({ x: 2, y: 2 });
		expect(chg.detail.rela).toEqual({ x: 1, y: 2 });


	});

	xit('cat rest', () => {
		// 起始有3点energy
		// 移动cavalry,消耗1点energy
		// 被动休息+2点energy
		// 所以是4点energy
		let chg: IEnergyChange = _.find(chBoard.chgList, chg => chg.round == 0 && chg.type == ChangeType.energy) as IEnergyChange;
		expect(chg.detail. rela).toBe(4);
		expect(chg.detail.restType).toBe(RestType.passive);
	});

	xit('cat cast skill', () => {
		let ch = chBoard.getChessByPosi({ x: 1, y: 7 });
		chBoard.chooseChess(ch);
		chBoard.moveChess({ x: 2, y: 6 });

		ch = chBoard.getChessByPosi({ x: 2, y: 2 });
		chBoard.chooseChess(ch);
		chBoard.moveChess({ x: 1, y: 4 });
		chBoard.chooseSkill(SkillType.storm);
		chBoard.chooseSkillTarget(ch.posi);

		let chg: IHpChange = _.find(chBoard.chgList, chg => chg.round == 1 && chg.type == ChangeType.hp) as IHpChange; 
		expect(chg.detail.abs).toBe(1);
		expect(chg.detail.rela).toBe(3);
	});

	



});


