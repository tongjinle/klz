/// <reference path="../../typings/index.d.ts" />
import {RestType, ChangeType, IPositionChange, IHpChange, IEnergyChange, ChessBoardStatus, ActionType, IPosition, IBox, IChessBoard, IChess, ISkill,  IRecord, IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';
import * as _ from 'underscore';
import ChessBoard from '../chessBoard/chessBoard';
import Chess from '../chess/chess';
import ChangeTable from '../changeTable';


describe('changes', () => {
	let chBoard: ChessBoard;
	let chgTable:ChangeTable;

	beforeAll(() => {
		chBoard = new ChessBoard();
		chgTable = chBoard.chgTable;
		chBoard.readMap('normal');

		chBoard.addPlayer('cat');
		chBoard.addPlayer('mouse');
		chBoard.ready('cat', PlayerStatus.ready);
		chBoard.ready('mouse', PlayerStatus.ready);

		// 开始游戏...
	});


	it('cat move chess', () => {
		let ch = chBoard.getChessByPosi({ x: 1, y: 0 });
		chBoard.chooseChess(ch);
		chBoard.moveChess({ x: 2, y: 2 });

		let chg: IPositionChange = chgTable.queryByRound(1)
			.queryByChangeType(ChangeType.position)
			.toList()[0] as IPositionChange;

		console.log(chgTable.recoList);

		expect(chg.detail. abs).toEqual({ x: 2, y: 2 });
		expect(chg.detail.rela).toEqual({ x: 1, y: 2 });


	});

	it('cat rest', () => {
		// 起始有3点energy
		// 移动cavalry,消耗1点energy
		// 被动休息+2点energy
		// 所以是4点energy
		let chg: IEnergyChange = chgTable.queryByRound(1)
			.queryByChangeType(ChangeType.energy)
			.toList()[0] as IEnergyChange;

		expect(chg.detail.abs).toBe(4);
		expect(chg.detail.restType).toBe(RestType.passive);
	});

	it('cat cast skill', () => {
		// mouse,round-2
		let ch = chBoard.getChessByPosi({ x: 1, y: 7 });
		chBoard.chooseChess(ch);
		chBoard.moveChess({ x: 2, y: 5 });

		// cat,round-3
		ch = chBoard.getChessByPosi({ x: 2, y: 2 });
		chBoard.chooseChess(ch);
		chBoard.moveChess({ x: 1, y: 4 });
		

		// mouse,round-4
		ch = chBoard.getChessByPosi({ x: 2, y: 5 });
		chBoard.chooseChess(ch);
		chBoard.moveChess({ x: 1, y: 3 });
		chBoard.chooseSkill(SkillType.crash);
		chBoard.chooseSkillTarget({x:1,y:4});
		// cat,round-5

		// mouse,round-6

		let chg: IHpChange = chgTable.queryByRound(4)
			.queryByChangeType(ChangeType.hp)
			.toList()[0] as IHpChange;

		expect(chg.detail.abs).toBe(1);
		expect(chg.detail.rela).toBe(3);
	});

	



});


