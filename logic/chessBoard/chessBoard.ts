import {IMap, IPosition, IChess, IChessBoard, IBox, ChessBoardStatus, IPlayer, ChessType, ChessColor, PlayerStatus,ChessStatus} from '../types';
import maps from '../maps';
import * as api from '../api';

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
	public get currPlayer() : IPlayer {
		return _(this.playerList).find(p=>p.name==this.pName);
	}


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
			this.chessList.push(ch);
		});
	}


	// 增加选手
	addPlayer(pName: string): boolean {
		const MAX_PLAYER_COUNT = 2;
		let pList = this.playerList;
		let color: ChessColor;
		if (pList.length == 2) {
			return false;
		} else if (pList.length == 1) {
			color = _.find(pList, p => p.color == ChessColor.red) ? ChessColor.black : ChessColor.red;
			let p: IPlayer = {
				name: pName,
				color,
				status: PlayerStatus.notReady,
				energy: 3
			};
		}
		return true;
	}

	// 删除选手
	removePlayer(pName: string): boolean {
		let pList = this.playerList;
		let p = this.getPlayerByName(pName);
		if (p) {
			pList = _.filter(pList, p => p.name != pName);
			return true;
		}
		return false;
	}

	// 选手准备/反准备
	setReady(pName: string, status: PlayerStatus): boolean {
		if (~[PlayerStatus.ready, PlayerStatus.notReady].indexOf(status)) {
			return false;
		}
		let p = _.find(this.playerList, p => p.name == pName);
		if (p && p.status != status) {
			p.status = status;
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
		let p = _.find(this.playerList,p=>p.color == ChessColor.red);
		this.round(p.name);
	}

	// 选手获得行动机会
	round(pName?: string) {
		let p:IPlayer;
		if (pName) {
			p = this.getPlayerByName(pName);
		}else{
			p = _.find(this.playerList,p=>p.name!=pName);
		}

		if(p){
			p.status = PlayerStatus.thinking;
		}
	}

	// 获取可以被选择的棋子
	getActiveChessList():IChess[]{
		let p =this.getPlayerByName(this.pName);
		return _(this.chessList).filter(ch=>ch.color == p.color && ch.energy<=p.energy);
	}

	// 选手选择棋子
	chooseChess(posi:IPosition):IChess{
		let p  =this.currPlayer;
		let ch = _(this.chessList).find(ch=>ch.color == p.color && ch.posi.x == posi.x && ch.posi.y == posi.y);
		ch.status = ChessStatus.beforeMove;
		return ch;
	}


	// 选手移动棋子
	// 选手选择技能
	// 选手选择技能目标
	// 选手休息
	// 选手投降
	// 胜负判断



	///////
	private getPlayerByName(pName: string): IPlayer {
		return _.find(this.playerList, p => p.name == pName);
	}

	private getPlayer():IPlayer{

	}
}

export default ChessBoard;