/// <reference path="../../typings/index.d.ts" />
import {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import _ = require('underscore');
import chessList from '../chess/chessList';
import skillList from '../skill/skillList';
import ChessBoard from '../chessBoard/chessBoard';
import Chess from '../chess/chess';

// 这里测试具体的skill

describe('chess list', () => {

	let chBoard: IChessBoard;


	beforeEach(() => {
		chBoard = new ChessBoard();
		chBoard.setMapSize(8, 8);


	});


	it('footman', () => {
		let me: IChess = Chess.createChessByType(ChessType.footman);
		let targetCh: IChess = new Chess();
		targetCh.hp = 100;

		me.posi = { x: 1, y: 1 };
		me.color = ChessColor.red;
		targetCh.posi = { x: 1, y: 3 };
		targetCh.color = ChessColor.black;

		chBoard.addChess(me);
		chBoard.addChess(targetCh);



		let sk: ISkill = me.skillList[0];

		// 超过attack的距离
		expect(sk.getCastRange().length).toBe(0);

		// me靠近me2
		me.posi.y = 2;
		let castRange = [
			{ x: 1, y: 3 }
		];

		expect(sk.getCastRange()).toEqual(castRange);

		// me攻击targetCh
		sk.cast(targetCh.posi);
		// 扣去targetCh 1点hp
		expect(targetCh.hp).toBe(99);

	});

	it('knight', () => {
		let me: IChess = Chess.createChessByType(ChessType.knight);
		me.posi = { x: 4, y: 4 };
		let sk = me.skillList[0];
		chBoard.addChess(me);

		let ch1: IChess = new Chess();
		ch1.posi = { x: 1, y: 5 };
		let ch2: IChess = new Chess();
		ch2.posi = { x: 1, y: 3 };
		ch1.hp = ch2.hp = 100;
		ch1.color = ch2.color = ChessColor.black;
		chBoard.addChess(ch1);
		chBoard.addChess(ch2);
		// 周围没有敌人
		expect(sk.getCastRange().length).toBe(0);

		// 周围有2个敌人,cast position为自己
		ch1.posi.x = ch2.posi.x = 4;
		expect(sk.getCastRange()).toEqual([me.posi]);

		// 成功攻击到周围2个敌人
		// 备注:伤害是3
		sk.cast(me.posi);
		expect(ch1.hp).toBe(97);
		expect(ch2.hp).toBe(97);

	});

	it('cavalry', () => {
		// 行走范围(特殊)
		let me = Chess.createChessByType(ChessType.cavalry);
		me.posi = { x: 1, y: 3 };
		chBoard.addChess(me);

		let ch1 = new Chess();
		ch1.posi = { x: 2, y: 5 };
		chBoard.addChess(ch1);

		let range = me.getMoveRange();
		let toStr = range => range.map(po => [po.x, po.y].join('-')).sort();
		expect(toStr(range)).toEqual(toStr([
			{ x: 0, y: 1 },
			{ x: 2, y: 1 },
			{ x: 0, y: 5 },
			{ x: 3, y: 2 },
			{ x: 3, y: 4 }
		]));
	});

	it('minister - heal - valid heal target', () => {
		let me = Chess.createChessByType(ChessType.minister);
		me.color = ChessColor.red;
		me.posi = { x: 2, y: 4 };
		chBoard.addChess(me);

		// 不满血友军,合法治疗目标
		let f1 = new Chess();
		f1.color = ChessColor.red;
		f1.posi = { x: 3, y: 4 };
		f1.hp = 2;
		f1.maxhp = 100;
		chBoard.addChess(f1);

		// 满血友军
		let f2 = new Chess();
		f2.color = ChessColor.red;
		f2.posi = { x: 4, y: 4 };
		f2.hp = 100;
		f2.maxhp = 100;
		chBoard.addChess(f2);

		// 超出距离的不满血友军
		let f3 = new Chess();
		f3.color = ChessColor.red;
		f3.posi = { x: 3, y: 3 };
		f3.hp = 2;
		f3.maxhp = 100;
		chBoard.addChess(f3);

		// 不满血的敌军
		let e1 = new Chess();
		e1.color = ChessColor.black;
		e1.posi = { x: 1, y: 4 };
		e1.hp = 2;
		e1.maxhp = 100;
		chBoard.addChess(e1);



		// 敌人不是我治疗的目标
		// 满血友军不是我治疗目标
		// 超越治疗距离不是我治疗目标(治疗距离为直线4格)
		let heal = _.find(me.skillList, sk => sk.type == SkillType.heal);
		expect(heal.getCastRange()).toEqual([{ x: 3, y: 4 }]);




	});

	it('minister - heal - no out', () => {
		// 治疗(不考虑视野遮挡)
		let me = Chess.createChessByType(ChessType.minister);
		me.color = ChessColor.red;
		me.posi = { x: 2, y: 4 };
		chBoard.addChess(me);

		// 不满血友军,合法治疗目标
		let f1 = new Chess();
		f1.color = ChessColor.red;
		f1.posi = { x: 3, y: 4 };
		f1.hp = 2;
		f1.maxhp = 100;
		chBoard.addChess(f1);

		// 满血友军
		let f2 = new Chess();
		f2.color = ChessColor.red;
		f2.posi = { x: 4, y: 4 };
		f2.hp = 90;
		f2.maxhp = 100;
		chBoard.addChess(f2);

		let toStr = range => range.map(po => [po.x, po.y].join('-')).sort();


		let heal = _.find(me.skillList, sk => sk.type == SkillType.heal);
		expect(toStr( heal.getCastRange())).toEqual(toStr([
			{ x: 3, y: 4 },
			{ x: 4, y: 4 }
		]));



	});

	it('minister - heal - effect', () => {
		// 治疗 && 过量治疗
		// 一次治疗量是6点血量
		let me = Chess.createChessByType(ChessType.minister);
		me.color = ChessColor.red;
		me.posi = { x: 2, y: 4 };
		chBoard.addChess(me);

		// 不满血友军,合法治疗目标
		let f1 = new Chess();
		f1.color = ChessColor.red;
		f1.posi = { x: 3, y: 4 };
		f1.hp = 2;
		f1.maxhp = 100;
		chBoard.addChess(f1);

		// 满血友军
		let f2 = new Chess();
		f2.color = ChessColor.red;
		f2.posi = { x: 4, y: 4 };
		f2.hp = 99;
		f2.maxhp = 100;
		chBoard.addChess(f2);

		let heal = _.find(me.skillList, sk => sk.type == SkillType.heal);
		heal.cast({x:3,y:4});
		expect(f1.hp).toBe(8);

		// 过量治疗
		heal.cast({x:4,y:4});
		expect(f2.hp).toBe(100);

	});

	it('minister - purge', () => {
		// 净化(不考虑视野遮挡)
		// 施法距离3格
		// 造成2点伤害
		let me = Chess.createChessByType(ChessType.minister);
		me.color = ChessColor.red;
		me.posi = { x: 2, y: 4 };
		chBoard.addChess(me);

		// 不满血的敌军
		let e1 = new Chess();
		e1.color = ChessColor.black;
		e1.posi = { x: 1, y: 4 };
		e1.hp = 20;
		chBoard.addChess(e1);

		let e2 = new Chess();
		e2.color = ChessColor.black;
		e2.posi = { x: 0, y: 4 };
		e2.hp = 20;
		chBoard.addChess(e2);

		let purge = _.find(me.skillList, sk => sk.type == SkillType.purge);
		let toStr = range => range.map(po => [po.x, po.y].join('-')).sort();

		expect(toStr (purge.getCastRange())).toEqual(toStr([
			{x:1,y:4},
			{x:0,y:4}
		]));

		purge.cast({x:0,y:4});

		expect(e1.hp).toBe(18);
		expect(e2.hp).toBe(18);

	});

	xit('magic - moveRange', () => {
		// 移动范围
		// 闪现,不会被视野遮挡
		let me = Chess.createChessByType(ChessType.magic);
		me.color = ChessColor.red;
		me.posi = {x:1,y:2};
		chBoard.addChess(me);

		let ch = new Chess();
		ch.color = ChessColor.black;
		ch.posi = {x:1,y:3};
		chBoard.addChess(ch);

		let toStr = range => range.map(po => [po.x, po.y].join('-')).sort();
		expect(toStr( ch.getMoveRange())).toEqual(toStr([
			// {x:1,y:3},
			{x:1,y:4},
			{x:1,y:5},
			{x:1,y:6},
			
			{x:2,y:2},
			{x:3,y:2},
			{x:4,y:2},
			{x:5,y:2},

			{x:1,y:1},
			{x:1,y:0},

			{x:0,y:2},
			//
			
			{x:0,y:1},

			{x:0,y:3},

			{x:2,y:3},
			{x:3,y:4},
			{x:4,y:5},

			{x:2,y:1},
			{x:3,y:0}
		]));
	});


	xit('magic - moveRange', () => {
		// 火球(考虑视野遮挡)
		let me = Chess.createChessByType(ChessType.magic);
		me.color = ChessColor.red;
		me.posi = {x:1,y:2};
		chBoard.addChess(me);

		let e1 = new Chess();
		e1.color = ChessColor.black;
		e1.posi = {x:1,y:3};
		chBoard.addChess(e1);

		let e2 = new Chess();
		e2.color = ChessColor.black;
		e2.hp = 20;
		e2.posi = {x:1,y:5};
		chBoard.addChess(e2);

		let sk = _.find(me.skillList,sk=>sk.type == SkillType.fire);
		expect(sk.getCastRange()).toEqual([{x:1,y:5}]);

		sk.cast({x:1,y:5});
		expect(e2.hp).toBe(12);
	});


	xit('magic - moveRange', () => {
		// 冰霜新星
		let me = Chess.createChessByType(ChessType.magic);
		me.color = ChessColor.red;
		me.posi = {x:1,y:2};
		chBoard.addChess(me);

		let e1 = new Chess();
		e1.color = ChessColor.black;
		e1.posi = {x:1,y:3};
		e1.hp = 20;
		chBoard.addChess(e1);

		let e2 = new Chess();
		e2.color = ChessColor.black;
		e2.posi = {x:1,y:4};
		e2.hp = 20;
		chBoard.addChess(e2);		

 		let e3 = new Chess();
		e3.color = ChessColor.black;
		e3.posi = {x:1,y:5};
		e3.hp = 20;
		chBoard.addChess(e3);

		let sk = _.find(me.skillList,sk=>sk.type == SkillType.fire);
		expect(sk.getCastRange()).toEqual([{x:1,y:2}]);

		sk.cast({x:1,y:2});
		expect(e1.hp).toBe(12);
		expect(e2.hp).toBe(12);
		expect(e3.hp).toBe(20);
	});


	xit('king', () => {
		// 顺势斩
		// 需要有正对的目标供king使用

		let me = Chess.createChessByType(ChessType.king);
		me.color = ChessColor.red;
		me.posi = {x:1,y:2};
		chBoard.addChess(me);

		let e1 = new Chess();
		e1.color = ChessColor.black;
		e1.posi = {x:1,y:3};
		e1.hp = 20;
		chBoard.addChess(e1);

		let e2 = new Chess();
		e2.color = ChessColor.black;
		e2.posi = {x:2,y:3};
		e2.hp = 20;
		chBoard.addChess(e2);	

		let sk = _.find(me.skillList,sk=>sk.type == SkillType.cleave);
		expect(sk.getCastRange()).toEqual([{x:1,y:3}]);

		sk.cast({x:1,y:3});
		expect(e1.hp).toBe(14);
		expect(e2.hp).toBe(14);


	});


































});
