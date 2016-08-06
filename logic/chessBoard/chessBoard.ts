import {SkillType, IMap, IPosition, IChess, ISkill, IChessBoard, IBox, ChessBoardStatus, IPlayer, ChessType, ChessColor, PlayerStatus, ChessStatus} from '../types';
import maps from '../maps';
import * as api from '../api';
import _ = require('underscore');


class ChessBoard implements IChessBoard {
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

	public currChess: IChess;
	public currSkill: ISkill;


	constructor(mapName: string = 'normal') {
		let map: IMap = maps[mapName];

		this.width = map.width;
		this.height = map.height;
		this.chessList = [];
		this.boxList = [];
		this.playerList = [];
		this.status = ChessBoardStatus.beforeStart;

		// 放置棋子
		this.init(map.chessList);
	}


	// 方法
	// ***************************************************
	// 初始化游戏
	// 默认的mapName为默认
	init(chessList: { chType: ChessType, color: ChessColor, posi: IPosition }[]) {
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
		return true;
	}

	removeChess(chess: IChess): boolean {
		if (!_.find(this.chessList, ch => ch.id === chess.id)) {
			return false;
		}
		this.chessList = _.filter(this.chessList, ch => ch.id != chess.id);
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
	round(pName?: string) {
		let p: IPlayer;
		if (pName) {
			this.pName = pName;
			p = this.getPlayerByName(pName);
		} else {
			p = _.find(this.playerList, p => p.name != this.pName);
		}

		if (p) {
			p.status = PlayerStatus.thinking;
			p.chStatus = ChessStatus.beforeChoose;
			this.status = ChessBoardStatus[ChessColor[p.color]];
		}
	}



	// 获取可以被选择的棋子
	getActiveChessList(): IChess[] {
		let p = this.currPlayer;
		console.log(this.chessList.length);
		_(this.chessList).filter(ch => {
			console.log(ch.color,ch.energy,p.color,p.energy);
			return ch.color == p.color && ch.energy <= p.energy;
		});
		return _(this.chessList).filter(ch => ch.color == p.color && ch.energy <= p.energy);
	}


	// 选手选择棋子
	chooseChess(ch: IChess) {
		ch.status = ChessStatus.beforeMove;
		this.currChess = ch;
	}

	unChooseChess(ch:IChess){
		
	}


	// 选手移动棋子
	moveChess(posi: IPosition) {
		let ch = this.currChess;
		api.chessApi.move(ch, this, posi);
	}

	// 选手选择技能
	chooseSkill(skType: SkillType) {
		this.currSkill = _.find(this.currChess.skillList, sk => sk.type === skType);
	}



	// 选手选择技能目标
	chooseSkillTarget(posi: IPosition) {

	}

	// 选手休息
	// 选手投降
	// 胜负判断



	///////
	private getPlayerByName(pName: string): IPlayer {
		return _.find(this.playerList, p => p.name == pName);
	}


}

export default ChessBoard;