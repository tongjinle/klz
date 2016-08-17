import {ChessBoardJudge, SkillType, IMap, IPosition, IChess, ISkill, IChessBoard, IBox, ChessBoardStatus, IPlayer, ChessType, ChessColor, PlayerStatus, ChessStatus} from '../types';
import maps from '../maps';
import * as api from '../api';
import _ = require('underscore');


class ChessBoard implements IChessBoard {
	seed: number;
	boxList: IBox[];
	chessList: IChess[];
	width: number;
	height: number;
	status: ChessBoardStatus;
	// 双方选手
	playerList: IPlayer[];

	// 当前行棋方名字
	pName: string;

	// 当前行棋方
	public get currPlayer(): IPlayer {
		return _(this.playerList).find(p => p.name == this.pName);
	}

	public set currPlayer(v: IPlayer) {
		this.pName = v.name;
	}

	public currChess: IChess;
	public currSkill: ISkill;


	constructor(mapName: string = 'normal') {
		this.chessList = [];
		this.boxList = [];
		this.playerList = [];
		this.status = ChessBoardStatus.beforeStart;
	}


	// 方法
	// ***************************************************
	readMap(mapName: string) {
		let map: IMap = maps[mapName];
		this.setMapSeed(map.seed);
		this.setMapSize(map.width, map.height);
		this.setMapChess(map.chessList);
	}

	// 设置随机种子
	setMapSeed(seed: number) {
		this.seed = seed;
	}

	// 设置棋盘尺寸
	setMapSize(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	// 初始化游戏
	// 默认的mapName为默认
	setMapChess(chessList: { chType: ChessType, color: ChessColor, posi: IPosition }[]) {
		_.each(chessList, d => {
			let ch = api.chessApi.create(d.chType);
			api.chessApi.setColor(ch, d.color);
			api.chessApi.setPosition(ch, d.posi);
			this.addChess(ch);
		});
	}


	// 增加选手
	addPlayer(pName: string): boolean {
		const MAX_PLAYER_COUNT = 2;
		let pList = this.playerList;
		let color: ChessColor;
		let p: IPlayer;
		if (pList.length == 2) {
			return false;
		} else if (pList.length == 1) {
			color = _.find(pList, p => p.color == ChessColor.red) ? ChessColor.black : ChessColor.red;

		} else if (pList.length == 0) {
			color = ChessColor.red;
		}
		p = {
			name: pName,
			color,
			status: PlayerStatus.notReady,
			chStatus: ChessStatus.rest,
			energy: 3
		};
		this.playerList.push(p);
		return true;
	}

	// 删除选手
	removePlayer(pName: string): boolean {
		let pList = this.playerList;
		let p = this.getPlayerByName(pName);
		if (p) {
			this.playerList = _.filter(pList, p => p.name != pName);
			return true;
		}
		return false;
	}

	addChess(chess: IChess): boolean {
		if (_.find(this.chessList, ch => ch.posi.x == chess.posi.x && ch.posi.y == chess.posi.y)) {
			return false;
		}
		this.chessList.push(chess);
		chess.chBoard = this;
		return true;
	}

	removeChess(chess: IChess): boolean {
		if (!_.find(this.chessList, ch => ch.id === chess.id)) {
			return false;
		}

		this.chessList = _.filter(this.chessList, ch => ch.id != chess.id);
		chess.chBoard = undefined;
		return true;
	}

	// 选手准备/反准备
	ready(pName: string, status: PlayerStatus): boolean {
		if ([PlayerStatus.ready, PlayerStatus.notReady].indexOf(status) < 0) {
			return false;
		}
		let p = _.find(this.playerList, p => p.name == pName);
		if (p && p.status != status) {
			p.status = status;

			// 是否都准备完毕
			if (this.canStart()) {
				this.start();
			}

			return true;
		}
		return false;
	}

	// 是否可以开始游戏
	private canStart(): boolean {
		return this.playerList.length == 2 && _.all(this.playerList, p => p.status == PlayerStatus.ready);
	}

	// 开始游戏
	start() {
		this.status = ChessBoardStatus.red;
		let p = _.find(this.playerList, p => p.color == ChessColor.red);
		this.round(p.name);
	}

	// 选手获得行动机会
	// 确定选手名字,则轮到该选手
	// 如果没有明确选手名字
	// 1.如果是第一回合,则红色下棋;
	// 2.如果不是第一个回合,则交换为对手下棋
	round(pName?: string) {
		let p: IPlayer;
		let lastP: IPlayer = this.currPlayer;

		// 清理
		if (this.currPlayer) {
			this.currPlayer.status = PlayerStatus.waiting;
			this.currPlayer.chStatus = ChessStatus.rest;
		}
		if (this.currChess) {
			this.currChess.status = ChessStatus.rest;
			this.currChess = undefined;
		}


		// 下一个选手
		if (pName) {
			this.pName = pName;
			p = this.getPlayerByName(pName);
		} else {
			if (lastP) {
				p = _.find(this.playerList, p => p != lastP);
				// console.log('交换选手下棋',p);
			} else {
				p = _.find(this.playerList, p => p.color == ChessColor.red);
			}
		}

		if (p) {
			p.status = PlayerStatus.thinking;
			p.chStatus = ChessStatus.beforeChoose;
			this.currPlayer = p;
			this.status = ChessBoardStatus[ChessColor[p.color]];
		}
	}



	// 获取可以被选择的棋子
	getActiveChessList(): IChess[] {
		let p = this.currPlayer;
		// console.log(this.chessList.length);
		_(this.chessList).filter(ch => {
			// console.log(ch.color,ch.energy,p.color,p.energy);
			return ch.color == p.color && ch.energy <= p.energy;
		});
		return _(this.chessList).filter(ch => ch.color == p.color && ch.energy <= p.energy);
	}


	// 选手选择棋子
	chooseChess(ch: IChess) {

		// 判断是否可以选择
		if (!_.find(this.getActiveChessList(), chi => chi == ch)) {
			return;
		}

		//  当前棋子的状态为"beforeMove"
		this.currChess = ch;
		this.currChess.status = ChessStatus.beforeMove;
		// 玩家状态也改变为"beforeMove"
		this.currPlayer.chStatus = ChessStatus.beforeMove;
	}

	unChooseChess() {
		if (this.currPlayer && this.currPlayer.chStatus == ChessStatus.beforeMove) {
			this.currPlayer.chStatus = ChessStatus.beforeChoose;
			if (this.currChess) {
				this.currChess.status = ChessStatus.beforeChoose;
				this.currChess = undefined;
			}
			if (this.currSkill) {
				this.currSkill = undefined;
			}
		}

	}


	// 选手移动棋子
	moveChess(posi: IPosition) {
		let ch = this.currChess;
		ch.move(posi);

		if (ch.status == ChessStatus.beforeCast) {
			this.currPlayer.chStatus = ChessStatus.beforeCast;
		} else if (ch.status == ChessStatus.rest) {
			this.currPlayer.chStatus = ChessStatus.rest;
			this.rest();
		}
	}

	// 选手选择技能
	chooseSkill(skType: SkillType) {
		this.currSkill = _.find(this.currChess.skillList, sk => sk.type === skType);
	}

	// 选手反选技能
	unChooseSkill() {
		if (this.currSkill) {
			this.currSkill = undefined;
		}
	}



	// 选手选择技能目标
	chooseSkillTarget(posi: IPosition) {
		if (this.currChess && this.currSkill) {
			// console.log(this.currSkill.getCastRange());
			// console.log(posi);
			if (_.find(this.currSkill.getCastRange(), po => po.x == posi.x && po.y == posi.y)) {
				this.currSkill.cast(posi);
			}
		}
	}

	// 选手休息
	rest() {
		// 玩家
		// 如果玩家下过棋
		if (this.currPlayer.chStatus == ChessStatus.rest) {
			this.currPlayer.energy -= this.currChess.energy;
			this.currPlayer.energy += this.passiveRestEnergy;
		} else if (this.currPlayer.chStatus == ChessStatus.beforeChoose) {
			this.currPlayer.energy += this.activeRestEnergy;
		}

		this.round();
	}


	// 选手投降
	surrender() { }



	// 胜负判断
	judge(): ChessBoardJudge {
		let redChessCount = _.filter(this.chessList, ch => ch.color == ChessColor.red).length;
		let blackChessCount = _.filter(this.chessList, ch => ch.color == ChessColor.black).length;

		if (redChessCount == 0 && blackChessCount == 0) {
			return ChessBoardJudge.equal;
		} else if (redChessCount == 0) {
			return ChessBoardJudge.black;
		} else if (blackChessCount == 0) {
			return ChessBoardJudge.red;
		}

		return ChessBoardJudge.none;
	}



	///////
	getPlayerByName(pName: string): IPlayer {
		return _.find(this.playerList, p => p.name == pName);
	}


	getChessByPosi(posi: IPosition) {
		return _.find(this.chessList, ch => ch.posi.x == posi.x && ch.posi.y == posi.y);
	}

	// 主动休息可以加4点energy
	private maxEnergy = 10;
	private activeRestEnergy = 4;
	private passiveRestEnergy = 2;
	private addRestEnergy() {
		this.currPlayer.energy
	}


}

export default ChessBoard;