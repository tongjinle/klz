/// <reference path="../../typings/index.d.ts" />
import _ = require('underscore');
import * as rangeApi from '../rangeApi';
import  {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';

describe('range api', () => {
	let sort = (posi: IPosition) => [posi.x, posi.y].join('-');

	it('lineRange', () => {
		let exp = [
			{ x: 1, y: 0 },
			{ x: 1, y: -1 }
		];
		expect(rangeApi.lineRange({ x: 1, y: 1 }, 2, 2)).toEqual(exp);
	});

	it('slashRange', () => {
		let exp = [
			{ x: 0, y: 0 },
			{ x: -1, y: -1 }
		];
		expect(rangeApi.slashRange({ x: 1, y: 1 }, 2, 2)).toEqual(exp);
	});

	it('nearRange', () => {
		let exp = [
			{ x: 1, y: 0 },
			{ x: 1, y: -1 },
			{ x: 1, y: 2 },
			{ x: 1, y: 3 },
			{ x: 0, y: 1 },
			{ x: -1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 3, y: 1 },
		];
		let rst = rangeApi.nearRange({ x: 1, y: 1 }, 2);
		expect(_.sortBy(rst, sort)).toEqual(_.sortBy(exp, sort));

	});

	it('circleRange', () => {
		let exp = [
			{ x: -1, y: 3 },
			{ x: -1, y: 2 },
			{ x: -1, y: 1 },
			{ x: -1, y: 0 },
			{ x: -1, y: -1 },

			{ x: 0, y: 3 },
			{ x: 0, y: 2 },
			{ x: 0, y: 1 },
			{ x: 0, y: 0 },
			{ x: 0, y: -1 },

			{ x: 1, y: 3 },
			{ x: 1, y: 2 },
			{ x: 1, y: 0 },
			{ x: 1, y: -1 },

			{ x: 2, y: 3 },
			{ x: 2, y: 2 },
			{ x: 2, y: 1 },
			{ x: 2, y: 0 },
			{ x: 2, y: -1 },

			{ x: 3, y: 3 },
			{ x: 3, y: 2 },
			{ x: 3, y: 1 },
			{ x: 3, y: 0 },
			{ x: 3, y: -1 }
		];
		expect(_.sortBy(rangeApi.circleRange({ x: 1, y: 1 }, 2), sort)).toEqual(_.sortBy(exp, sort));
		// console.log(_.sortBy(rangeApi.circleRange({ x: 1, y: 1 }, 2)));
		// console.log('----');
		// console.log(_.sortBy(exp, sort));
	});

	it('manhattan',()=>{
		let exp=[
			{ x: -1, y: 1 },

			{ x: 0, y: 2 },
			{ x: 0, y: 1 },
			{ x: 0, y: 0 },

			{ x: 1, y: 3 },
			{ x: 1, y: 2 },
			{ x: 1, y: 0 },
			{ x: 1, y: -1 },

			{ x: 2, y: 2 },
			{ x: 2, y: 1 },
			{ x: 2, y: 0 },

			{ x: 3, y: 1 }
		];
		expect(_.sortBy(rangeApi.manhattanRange({x:1,y:1},2),sort)).toEqual(_.sortBy(exp,sort));
	});

	it('unique',()=>{
		let source =[
			{x:1,y:1},
			{x:1,y:1},
			{x:1,y:2},
			{x:1,y:2}
		];

		let target =[
			{x:1,y:1},
			{x:1,y:2}
		];

		let exp = rangeApi.unique(source);

		expect(exp).toEqual(target);

	});

	it('sub',()=>{
		let source =[
			{x:1,y:1},
			{x:1,y:3},
			{x:1,y:2}
		];

		let target =[
			{x:1,y:1},
			{x:1,y:2}
		];

		let exp = rangeApi.sub(source,target);

		expect(exp).toEqual([{x:1,y:3}]);
	});

	it('getBetween',()=>{
		let pa ={x:1,y:4};
		let pb={x:1,y:2};

		let target = [
			{x:1,y:3}
		];

		expect(rangeApi.getBetween(pa,pb)).toEqual(target);


	});

});







