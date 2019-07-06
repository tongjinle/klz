// import {ChessBoardJudge, ChessBoardStatus, IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';
// import ChessBoard from '../chessBoard/chessBoard';
// import * as api from '../api';
// import Chess from '../chess/chess';
// import Skill from '../skill/skill';

// describe('chessBoard', () => {
// 	let chBoard: IChessBoard;

// 	beforeEach(() => {
// 		chBoard = new ChessBoard();
// 		chBoard.readMap('normal');
// 	});

// 	// 初始化普通地图
// 	it('init normal', () => {
// 		expect(chBoard.chessList.length).toEqual(32);
// 	});

// 	// 增加/删除选手
// 	it('add/remove player', () => {
// 		chBoard.addPlayer('jack');
// 		expect(_.find(chBoard.playerList, p => p.name == 'jack')).not.toBeUndefined();

// 		chBoard.addPlayer('tom');
// 		chBoard.addPlayer('lily');
// 		expect(_.find(chBoard.playerList, p => p.name == 'lily')).toBeUndefined();

// 		chBoard.removePlayer('jack');
// 		chBoard.addPlayer('lilei');
// 		let p: IPlayer = _.find(chBoard.playerList, p => p.name == 'lilei');
// 		expect(p.color).toBe(ChessColor.red);
// 	});

// 	// 选手准备,会自动开启游戏
// 	it('ready', () => {

// 		chBoard.addPlayer('jack');
// 		chBoard.addPlayer('tom');

// 		let jack = _.find(chBoard.playerList, p => p.name == 'jack');
// 		let tom = _.find(chBoard.playerList, p => p.name == 'tom');

// 		expect(chBoard.status).toBe(ChessBoardStatus.beforeStart);
// 		expect(jack.status).toBe(PlayerStatus.notReady);
// 		expect(tom.status).toBe(PlayerStatus.notReady);

// 		chBoard.ready('jack', PlayerStatus.ready);
// 		chBoard.ready('jack', PlayerStatus.notReady);
// 		chBoard.ready('tom', PlayerStatus.ready);
// 		expect(chBoard.status).toBe(ChessBoardStatus.beforeStart);

// 		chBoard.ready('jack', PlayerStatus.ready);
// 		expect(chBoard.status).toBe(ChessBoardStatus.red);
// 	});

// });

// describe('chessBoard basis', () => {
// 	let chBoard: IChessBoard;
// 	let jack: IPlayer;
// 	let tom: IPlayer;

// 	beforeEach(() => {

// 		chBoard = new ChessBoard();
// 		chBoard.setMapSize(8, 8);

// 		chBoard.addPlayer('jack');
// 		chBoard.addPlayer('tom');

// 		// 选手准备
// 		chBoard.ready('jack', PlayerStatus.ready);
// 		chBoard.ready('tom', PlayerStatus.ready);

// 		jack = _.find(chBoard.playerList, p => p.name == 'jack');
// 		tom = _.find(chBoard.playerList, p => p.name == 'tom');
// 	});

// 	// 获取当前选手
// 	it('currPlayer', () => {
// 		chBoard.round('tom');
// 		expect(chBoard.currPlayer.name).toBe('tom');
// 	});

// 	// 获取当前选手的状态
// 	it('currPlayerStatus', () => {
// 		chBoard.round('jack');
// 		expect(jack.status).toBe(PlayerStatus.thinking);
// 		expect(jack.chessStatus).toBe(ChessStatus.beforeChoose);
// 	});

// 	// 获取可以被选择的的棋子
// 	it('chessCanBeChoose', () => {

// 		let list = [
// 			{ id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
// 			{ id: 1, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red },
// 			{ id: 2, energy: 1, posi: { x: 1, y: 3 }, color: ChessColor.black },
// 			{ id: 3, energy: 5, posi: { x: 1, y: 4 }, color: ChessColor.red },

// 		];

// 		_.each(list, n => {
// 			let ch: IChess = new Chess();
// 			ch.id = n.id;
// 			ch.energy = n.energy;
// 			ch.posi = n.posi;
// 			ch.color = n.color;
// 			ch.getMoveRange = () => [{ x: -1, y: -1 }];
// 			chBoard.addChess(ch);
// 		});

// 		// repMgr.parse({
// 		// 	action:"addChess",
// 		// 	data:{
// 		// 		chessType:ChessType.footman,
// 		// 		position:{x:11,y:1},
// 		// 		chessColor:ChessColor.red
// 		// 	}
// 		// });
// 		// repMgr.parse({
// 		// 	action:"addChess",
// 		// 	data:{
// 		// 		chessType:ChessType.footman,
// 		// 		position:{x:1,y:1},
// 		// 		chessColor:ChessColor.red
// 		// 	}
// 		// });
// 		// repMgr.parse({
// 		// 	action:"addChess",
// 		// 	data:{
// 		// 		chessType:ChessType.footman,
// 		// 		position:{x:1,y:1},
// 		// 		chessColor:ChessColor.red
// 		// 	}
// 		// });
// 		// repMgr.parse({
// 		// 	action:"addChess",
// 		// 	data:{
// 		// 		chessType:ChessType.footman,
// 		// 		position:{x:1,y:1},
// 		// 		chessColor:ChessColor.red
// 		// 	}
// 		// });

// 		jack.energy = 3;
// 		let activeChList = chBoard.getActiveChessList();
// 		expect(_.map(activeChList, ch => ch.id)).toEqual([0, 1])
// 	});

// 	// 选手选择棋子
// 	// 选择能被选择的
// 	it('chooseChess', () => {
// 		let list = [
// 			{ id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
// 			{ id: 1, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red },
// 			{ id: 2, energy: 1, posi: { x: 1, y: 3 }, color: ChessColor.black },
// 			{ id: 3, energy: 5, posi: { x: 1, y: 4 }, color: ChessColor.red },

// 		];

// 		_.each(list, n => {
// 			let ch: IChess = new Chess();
// 			ch.id = n.id;
// 			ch.energy = n.energy;
// 			ch.posi = n.posi;
// 			ch.color = n.color;
// 			ch.getMoveRange = () => [{ x: -1, y: -1 }];
// 			chBoard.addChess(ch);
// 		});

// 		jack.energy = 3;
// 		let ch: IChess = _.find(chBoard.chessList, ch => ch.id == 0);
// 		chBoard.chooseChess(ch);
// 		expect(jack.chessStatus).toBe(ChessStatus.beforeMove);
// 		// expect(ch.status).toBe(ChessStatus.beforeMove);
// 		// expect(chBoard.currChess).toBe(ch);
// 	});

// 	// 选择别人的棋子(应该出错)
// 	// 选不到会让当前的currChess成为undefined
// 	it('chooseChess(chess of enemy)', () => {

// 		let list = [
// 			{ id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.black }
// 		];

// 		_.each(list, n => {
// 			let ch: IChess = new Chess();
// 			ch.id = n.id;
// 			ch.energy = n.energy;
// 			ch.posi = n.posi;
// 			ch.color = n.color;
// 			chBoard.addChess(ch);
// 		});

// 		jack.energy = 3;
// 		let ch: IChess = _.find(chBoard.chessList, ch => ch.id == 0);
// 		chBoard.chooseChess(ch);
// 		expect(jack.chessStatus).toBe(ChessStatus.beforeChoose);
// 		expect(ch.status).toBe(ChessStatus.beforeChoose);
// 		expect(chBoard.currChess).toBeUndefined();

// 	});

// 	// 选择energy不足的棋子(应该出错)
// 	it('chooseChess(out of energy)', () => {

// 		let list = [
// 			{ id: 0, energy: 5, posi: { x: 1, y: 1 }, color: ChessColor.red }

// 		];

// 		_.each(list, n => {
// 			let ch: IChess = new Chess();
// 			ch.id = n.id;
// 			ch.energy = n.energy;
// 			ch.posi = n.posi;
// 			ch.color = n.color;
// 			chBoard.addChess(ch);
// 		});

// 		jack.energy = 3;
// 		let ch: IChess = _.find(chBoard.chessList, ch => ch.id == 0);
// 		chBoard.chooseChess(ch);
// 		expect(jack.chessStatus).toBe(ChessStatus.beforeChoose);
// 		expect(ch.status).toBe(ChessStatus.beforeChoose);
// 		expect(chBoard.currChess).toBeUndefined();

// 	});

// 	// 选手反选当前棋子
// 	it('unChooseChess', () => {

// 		let list = [
// 			{ id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red }
// 		];
// 		_.each(list, n => {
// 			let ch: IChess = new Chess();
// 			ch.id = n.id;
// 			ch.energy = n.energy;
// 			ch.posi = n.posi;
// 			ch.color = n.color;
// 			chBoard.addChess(ch);
// 		});

// 		jack.energy = 3;
// 		let ch: IChess = _.find(chBoard.chessList, ch => ch.id == 0);
// 		chBoard.chooseChess(ch);
// 		chBoard.unChooseChess();
// 		expect(jack.chessStatus).toBe(ChessStatus.beforeChoose);
// 		expect(ch.status).toBe(ChessStatus.beforeChoose);
// 		expect(chBoard.currChess).toBeUndefined();
// 	});

// 	// 选手移动棋子
// 	it('moveChess', () => {
// 		let list = [
// 			{ id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
// 			{ id: 1, energy: 1, posi: { x: 1, y: 4 }, color: ChessColor.black }

// 		];
// 		_.each(list, n => {
// 			let ch: IChess = new Chess();
// 			ch.id = n.id;
// 			ch.energy = n.energy;
// 			ch.posi = n.posi;
// 			ch.color = n.color;
// 			ch.getMoveRange = ()=>[{x:-1,y:-1}];
// 			chBoard.addChess(ch);
// 		});

// 		let chBlack: IChess = _.find(chBoard.chessList, ch => ch.id == 1);
// 		let sk = new Skill();
// 		sk.type = SkillType.attack;
// 		sk.getCastRange = () => {
// 			let range = api.rangeApi.nearRange(sk.owner.posi, 1);
// 			let chBoard = sk.owner.chBoard;
// 			range = _.filter(range, posi => {
// 				let ch = chBoard.getChessByPosi(posi);
// 				return ch && ch.color != sk.owner.color;
// 			});
// 			return range;
// 		};
// 		chBlack.skillList.push(sk);
// 		sk.owner = chBlack;

// 		let ch: IChess;
// 		// jack移动了棋子,然后没有攻击目标,自动进入休息
// 		expect(chBoard.currPlayer).toBe(jack);
// 		jack.energy = 3;
// 		ch = _.find(chBoard.chessList, ch => ch.id == 0);
// 		chBoard.chooseChess(ch);
// 		chBoard.moveChess({ x: 1, y: 2 });

// 		expect(ch.posi).toEqual({ x: 1, y: 2 });
// 		expect(jack.status).toBe(PlayerStatus.waiting);
// 		expect(jack.chessStatus).toBe(ChessStatus.rest);
// 		expect(ch.status).toBe(ChessStatus.rest);
// 		expect(chBoard.currChess).toBeUndefined();

// 		// tom移动了棋子,然后有攻击目标
// 		expect(chBoard.currPlayer).toBe(tom);
// 		tom.energy = 10;
// 		ch = _.find(chBoard.chessList, ch => ch.id == 1);
// 		chBoard.chooseChess(ch);
// 		chBoard.moveChess({ x: 1, y: 3 });
// 		expect(tom.status).toBe(PlayerStatus.thinking);
// 		expect(tom.chessStatus).toBe(ChessStatus.beforeCast);
// 		expect(ch.status).toBe(ChessStatus.beforeCast);
// 		expect(chBoard.currChess).not.toBeUndefined();

// 	});

// 	// 选手选择技能
// 	it('chooseSkill', () => {
// 		// 在有技能可以被选择的情况下,选择之后currSkill能正确显示
// 		let list = [
// 			{ id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
// 			{ id: 1, energy: 1, posi: { x: 1, y: 4 }, color: ChessColor.black }

// 		];
// 		_.each(list, n => {
// 			let ch: IChess = new Chess();
// 			ch.id = n.id;
// 			ch.energy = n.energy;
// 			ch.posi = n.posi;
// 			ch.color = n.color;
// 			chBoard.addChess(ch);
// 		});

// 		let ch: IChess = _.find(chBoard.chessList, ch => ch.id == 0);
// 		let skList = [
// 			{ type: 0, getCastRange: () => [{ x: 5, y: 5 }] },
// 			{ type: 1, getCastRange: () => [] },
// 		];
// 		_.each(skList, n => {
// 			let sk = new Skill();
// 			sk.type = n.type;
// 			sk.getCastRange = n.getCastRange;
// 			ch.skillList.push(sk);
// 			sk.owner = ch;
// 		});

// 		chBoard.chooseChess(ch);
// 		expect(ch.canCastSkillList.length).toBe(1);
// 		expect(ch.canCastSkillList[0].type).toBe(0);

// 		chBoard.chooseSkill(0);
// 		expect(chBoard.currSkill).toBe(ch.skillList[0]);

// 		// ssid@hxsd123

// 	});

// 	// 选手反选技能
// 	it('unchooseSkill', () => {
// 		let list = [
// 			{ id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
// 			{ id: 1, energy: 1, posi: { x: 1, y: 4 }, color: ChessColor.black },
// 			{ id: 2, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red }

// 		];
// 		_.each(list, n => {
// 			let ch: IChess = new Chess();
// 			ch.id = n.id;
// 			ch.energy = n.energy;
// 			ch.posi = n.posi;
// 			ch.color = n.color;
// 			chBoard.addChess(ch);
// 		});

// 		let ch: IChess;
// 		let skList = [
// 			{ chId: 0, type: 0, getCastRange: () => [{ x: 5, y: 5 }] },
// 			{ chId: 2, type: 0, getCastRange: () => [{ x: 5, y: 5 }] },
// 			{ chId: 0, type: 1, getCastRange: () => [] }
// 		];
// 		_.each(skList, n => {
// 			let sk = new Skill();
// 			sk.type = n.type;
// 			sk.getCastRange = n.getCastRange;
// 			let ch = _.find(chBoard.chessList, ch => ch.id == n.chId);
// 			ch.skillList.push(sk);
// 			sk.owner = ch;
// 		});

// 		ch = _.find(chBoard.chessList, ch => ch.id == 0);
// 		// 没有技能被选择的情况下,反选之后为undefined
// 		chBoard.unChooseSkill();
// 		expect(chBoard.currSkill).toBeUndefined();

// 		// 在选择了技能的情况下,可以反选
// 		// 反选之后,当前技能为空
// 		chBoard.chooseChess(ch);
// 		chBoard.chooseSkill(0);
// 		expect(chBoard.currSkill).toBe(ch.skillList[0]);
// 		chBoard.unChooseSkill();
// 		expect(chBoard.currSkill).toBeUndefined();

// 	});

// 	it('unchooseSkill-unchooseChess', () => {
// 		let list = [
// 			{ id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
// 			{ id: 1, energy: 1, posi: { x: 1, y: 4 }, color: ChessColor.black },
// 			{ id: 2, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red }

// 		];
// 		_.each(list, n => {
// 			let ch: IChess = new Chess();
// 			ch.id = n.id;
// 			ch.energy = n.energy;
// 			ch.posi = n.posi;
// 			ch.color = n.color;
// 			chBoard.addChess(ch);
// 		});

// 		let ch: IChess;
// 		let skList = [
// 			{ chId: 0, type: 0, getCastRange: () => [{ x: 5, y: 5 }] },
// 			{ chId: 2, type: 1, getCastRange: () => [{ x: 5, y: 5 }] },
// 			{ chId: 0, type: 2, getCastRange: () => [] }
// 		];
// 		_.each(skList, n => {
// 			let sk = new Skill();
// 			sk.type = n.type;
// 			sk.getCastRange = n.getCastRange;
// 			let ch = _.find(chBoard.chessList, ch => ch.id == n.chId);
// 			ch.skillList.push(sk);
// 			sk.owner = ch;
// 		});

// 		// 改选了棋子之后,会自动反选技能
// 		ch = _.find(chBoard.chessList, ch => ch.id == 0);
// 		chBoard.chooseChess(ch);
// 		chBoard.chooseSkill(0);
// 		expect(chBoard.currSkill).toBe(ch.skillList[0]);
// 		// 改选棋子
// 		ch = _.find(chBoard.chessList, ch => ch.id == 2);
// 		chBoard.unChooseChess()
// 		expect(chBoard.currSkill).toBeUndefined();

// 	});

// 	// 选手攻击棋子
// 	it('castSkill', () => {
// 		// jack使用棋子0的技能0攻击tom的棋子1,造成100伤害
// 		let list = [
// 			{ id: 0, hp: 10, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
// 			{ id: 1, hp: 10, energy: 1, posi: { x: 1, y: 4 }, color: ChessColor.black },
// 			{ id: 2, hp: 10, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red }

// 		];
// 		_.each(list, n => {
// 			let ch: IChess = new Chess();
// 			ch.id = n.id;
// 			ch.hp = 10;
// 			ch.energy = n.energy;
// 			ch.posi = n.posi;
// 			ch.color = n.color;
// 			chBoard.addChess(ch);
// 		});
// 		let chOfJack = _.find(chBoard.chessList, ch => ch.id == 0);
// 		let chOfTom = _.find(chBoard.chessList, ch => ch.id == 2);

// 		let ch: IChess;
// 		let skList = [
// 			{
// 				chId: 0, type: 0, getCastRange: () => [{ x: 1, y: 4 }], cast: (posi) => {
// 					// console.log('use skill cast');
// 					chOfTom.hp = 9;
// 				}
// 			},
// 			{ chId: 2, type: 1, getCastRange: () => [{ x: 5, y: 5 }], cast: undefined },
// 			{ chId: 0, type: 2, getCastRange: () => [], cast: undefined }
// 		];
// 		_.each(skList, n => {
// 			let sk = new Skill();
// 			sk.type = n.type;
// 			sk.getCastRange = n.getCastRange;
// 			sk.cast = n.cast;
// 			let ch = _.find(chBoard.chessList, ch => ch.id == n.chId);
// 			ch.skillList.push(sk);
// 			sk.owner = ch;
// 		});

// 		expect(chOfTom.hp).toBe(10);
// 		chBoard.chooseChess(chOfJack);
// 		chBoard.chooseSkill(0);
// 		chBoard.chooseSkillTarget({ x: 1, y: 4 });
// 		expect(chOfTom.hp).toBe(9);
// 		expect(chOfJack.status).toBe(ChessStatus.rest);
// 		expect(jack.status).toBe(PlayerStatus.waiting);
// 		expect(jack.chessStatus).toBe(ChessStatus.rest);

// 	});

// 	// 选手休息/选手的自动休息
// 	// 已经在前面的测试里做完

// 	// 主动休息和被动休息
// 	it('rest', () => {
// 		let list = [
// 			{ id: 0, hp: 10, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
// 			{ id: 1, hp: 10, energy: 1, posi: { x: 1, y: 4 }, color: ChessColor.black },
// 			{ id: 2, hp: 10, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red }

// 		];
// 		_.each(list, n => {
// 			let ch: IChess = new Chess();
// 			ch.id = n.id;
// 			ch.hp = 10;
// 			ch.energy = n.energy;
// 			ch.posi = n.posi;
// 			ch.color = n.color;
// 			ch.getMoveRange =()=>[{x:-1,y:-1}];
// 			chBoard.addChess(ch);
// 		});

// 		jack.energy = 0;
// 		tom.energy = 5;
// 		// 主动休息加4点能量
// 		chBoard.rest();
// 		expect(jack.energy).toBe(4);
// 		expect(chBoard.currPlayer).toBe(tom);
// 		// 被动休息加2点能量
// 		let ch = _.find(chBoard.chessList, ch => ch.id == 1);
// 		chBoard.chooseChess(ch);
// 		chBoard.moveChess({ x: 1, y: 3 });
// 		chBoard.rest();
// 		expect(tom.energy).toBe(6);

// 	});

// 	// 判断胜负
// 	it('judge', () => {
// 		// 没有棋子了的一方 就获胜
// 		let list = [
// 			{ id: 0, hp: 10, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
// 			{ id: 1, hp: 10, energy: 1, posi: { x: 1, y: 4 }, color: ChessColor.black }

// 		];
// 		_.each(list, n => {
// 			let ch: IChess = new Chess();
// 			ch.id = n.id;
// 			ch.hp = 10;
// 			ch.energy = n.energy;
// 			ch.posi = n.posi;
// 			ch.color = n.color;
// 			chBoard.addChess(ch);
// 		});

// 		let judge: ChessBoardJudge;
// 		judge = chBoard.judge();
// 		expect(judge).toBe(ChessBoardJudge.none);

// 		let ch: IChess = _.find(chBoard.chessList, ch => ch.id == 0);
// 		chBoard.removeChess(ch);
// 		judge = chBoard.judge();
// 		expect(judge).toBe(ChessColor.black);

// 	});

// });
