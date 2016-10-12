/// <reference path="../../typings/index.d.ts" />

import {IChessInfo,IChessBoardInfo,ISkillInfo,IPlayerInfo, RestType, IPositionChange, IHpChange, IEnergyChange, ChangeType, ActionType, ChessBoardJudge, SkillType, IMap, IChange, IPosition, IChess, ISkill, IChessBoard, IBox, ChessBoardStatus, IPlayer, ChessType, ChessColor, PlayerStatus, ChessStatus} from '../types';
import maps from '../maps';
import * as api from '../api';
import _ = require('underscore');
import Replay from '../replay';
import ChangeTable from '../changeTable';
import {conf} from '../conf';
import Chess  from '../chess/chess';
import Skill  from '../skill/skill';
import Player from '../player/player';


class ChessBoard implements IChessBoard {
	constructor() {
		this.id = parseInt(_.uniqueId());
		this.roundIndex = 0;
		this.chessList = [];
		this.boxList = [];
		this.playerList = [];
		this.status = ChessBoardStatus.beforeStart;
		this.rep = new Replay();
		this.chgTable = new ChangeTable();
	}

	id:number;
	mapName:string;
	rep: Replay;
	chgTable: ChangeTable;

	seed: number;
	roundIndex: number;
	boxList: IBox[];
	chessList: IChess[];
	width: number;
	height: number;
	status: ChessBoardStatus;
	winColor:ChessColor;
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

	snapshot: IChessBoardInfo;



	// 方法
	// ***************************************************

	// 记录rep
	writeRecord(action: ActionType, data: any) {
		this.rep.recoList.push({
			round: this.roundIndex,
			action,
			data
		});
	}

	// 记录change
	writeChange(cht: ChangeType, data: any) {
		let chg: IChange<{}> = {
			round: this.roundIndex,
			playerName:this.currPlayer.name,
			type: cht,
			detail: data
		};
		this.chgTable.recoList.push(chg);
	}


	readMap(mapName: string) {
		let map: IMap = maps[mapName];
		this.mapName = mapName;
		this.setMapSeed(map.seed);
		this.setMapSize(map.width, map.height);
		this.setMapChess(map.chessList);
	}

	// 设置随机种子
	setMapSeed(seed: number) {
		this.seed = seed;

		this.writeRecord(ActionType.setMapSeed, { seed });
	}

	// 设置棋盘尺寸
	setMapSize(width: number, height: number) {
		this.width = width;
		this.height = height;

		this.writeRecord(ActionType.setMapSize, { width, height });
	}

	// 初始化游戏
	// 默认的mapName为默认
	setMapChess(chessList: { chType: ChessType, color: ChessColor, posi: IPosition }[]) {
		_.each(chessList, d => {
			let ch = api.chessApi.create(d.chType);
			api.chessApi.setColor(ch, d.color);
			api.chessApi.setPosition(ch, d.posi);
			this.addChess(ch);

			this.writeRecord(ActionType.addChess, {
				chessType: d.chType,
				position: d.posi,
				chessColor: d.color
			});
		});
	}


	// 增加选手
	addPlayer(pName: string): boolean {
		const MAX_PLAYER_COUNT = conf.MAX_PLAYER_COUNT;
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

		p = new Player();
		p.name = pName;
		p.color = color;
		p.status = PlayerStatus.notReady;
		p.chStatus = ChessStatus.rest;
		p.energy = conf.PLAYER_ENERGY;

		
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

				this.writeRecord(ActionType.addPlayer, {
					red: _.find(this.playerList, p => p.color == ChessColor.red).name,
					black: _.find(this.playerList, p => p.color == ChessColor.black).name
				});

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
		this.snapshot = this.toString();

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
		if (this.currSkill) {
			this.currSkill = undefined;
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

		this.roundIndex++;
	}



	// 获取可以被选择的棋子
	getActiveChessList(): IChess[] {
		let p = this.currPlayer;


		return _(this.chessList).filter(
			ch => ch.color == p.color
				&& ch.energy <= p.energy
				&& (
					ch.getMoveRange().length > 0
					||
					// false 
					!!_.find(ch.skillList, sk => ch.getCastRange(sk.type).length > 0)
				)
		);
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
		let lastPosi = _.clone(ch.posi);
		ch.move(posi);

		// 必须在rest前做好replay记录
		// 否则round会成为2
		this.writeRecord(ActionType.chooseChess, { position: { x: lastPosi.x, y: lastPosi.y } });
		this.writeRecord(ActionType.moveChess, { position: { x: ch.posi.x, y: ch.posi.y } });

		// 记录change
		this.writeChange(ChangeType.position, {
			sourceChessId:this.currChess.id,
			abs: _.clone(ch.posi),
			rela: { x: ch.posi.x - lastPosi.x, y: ch.posi.y - lastPosi.y }
		});


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
				let lastChessHpDict = getChessHpDict(this.chessList);
				this.currSkill.cast(posi);
				let currChessHpDict = getChessHpDict(this.chessList);
				_.each(currChessHpDict,(v,k)=>{
					if(v!=lastChessHpDict[k]){
						this.writeChange(ChangeType.hp,{
							sourceChessId:this.currChess.id,
							targetChessId:k,
							skillId:this.currSkill.id,
							abs:v,
							rela:v-lastChessHpDict[k]
						});
					}
				});

				// 移除死亡的棋子
				this.chessList = _.filter(this.chessList, ch => ch.hp > 0);

				this.writeRecord(ActionType.chooseSkill, { skillType: this.currSkill.type });
				this.writeRecord(ActionType.castSkill, { position: _.clone(posi) })

				this.currSkill = undefined;
				this.currChess.status = ChessStatus.rest;
				this.currPlayer.chStatus = ChessStatus.rest;
				this.currPlayer.status = PlayerStatus.waiting;

				this.rest();
			}

		}

		function getChessHpDict(chessList:IChess[]):{[chessId:string]:number}{
			var dict:{[chessId:string]:number} ={};
			_.each(chessList,ch=>{
				dict[ch.id]=ch.hp;
			});
			return dict;
		}
	}


	// 选手休息
	rest() {
		let lastEnergy: number = this.currPlayer.energy;
		let restType:RestType;
		// 玩家
		// 如果玩家下过棋
		if (this.currPlayer.chStatus == ChessStatus.rest) {
			this.currPlayer.energy -= this.currChess.energy;
			this.currPlayer.energy += this.passiveRestEnergy;

			restType = RestType.passive;

		} else if (this.currPlayer.chStatus == ChessStatus.beforeChoose) {
			this.currPlayer.energy += this.activeRestEnergy;

			restType = RestType.active;

			// write replay
			this.writeRecord(ActionType.rest, undefined);


		}

		// write change
		this.writeChange(ChangeType.energy, {
			abs: this.currPlayer.energy,
			rela: this.currPlayer.energy - lastEnergy,
			restType
		});

		this.round();
	}


	// 选手投降
	surrender(playerName):ChessBoardStatus {
		// 不合法的玩家投降
		let player = _.find(this.playerList, (p) => p.name == playerName);
		if (!player){
			return;
		}
		// 非进行中的棋局
		if (this.status != ChessBoardStatus.red && this.status != ChessBoardStatus.black) {
			return;
		}

		this.status = ChessBoardStatus.gameOver;
		this.winColor = player.color == ChessColor.red ? ChessColor.black : ChessColor.red;
		return this.status;
	}



	// 胜负判断
	judge(): ChessBoardJudge {
		if(this.winColor == ChessColor.red){
			return ChessBoardJudge.red;
		}else if(this.winColor==ChessColor.black){
			return ChessBoardJudge.black;
		}
		
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


	parse(info:string):void{
		let chBoardInfo:IChessBoardInfo = JSON.parse(info) as IChessBoardInfo;
		this.id = chBoardInfo.id;
		this.mapName = chBoardInfo.mapName;
		this.seed = chBoardInfo.seed;
		this.width = chBoardInfo.width;
		this.height = chBoardInfo.height;
		this.status = chBoardInfo.status;
		this.winColor = chBoardInfo.winColor;

		this.chessList = _.map(chBoardInfo.chessList, ch => {
			return Chess.parse(ch, this);
		});

		this.playerList = _.map(chBoardInfo.playerList, p => {
			return Player.parse(p);
		});

		this.currPlayer = _.find(this.playerList, p => p.name == chBoardInfo.currPlayerName);
		this.currChess = _.find(this.chessList, ch => ch.id == chBoardInfo.currChessId);
		this.currSkill = this.currChess ? _.find(this.currChess.skillList, sk => sk.id == chBoardInfo.currSkillId) : undefined;
	}

	toString():IChessBoardInfo{
		let info: IChessBoardInfo = {} as IChessBoardInfo;
		// id: number;
		// mapName: string;
		// seed: number;
		// roundIndex: number;
		// width: number;
		// height: number;
		// status: ChessBoardStatus;
		// winColor: ChessColor;
		// // 双方选手
		// chessList: IChessInfo[];
		// playerList: IPlayerInfo[];
		// skillList: ISkillInfo[];

		// currPlayerId: number;
		// currChessId: number;
		// currSkillId: number;

		info.id = this.id;
		info.mapName = this.mapName;
		info.seed = this.seed;
		info.roundIndex = this.roundIndex;
		info.width = this.width;
		info.height = this.height;
		info.status = this.status;
		info.winColor = this.winColor;
		info.chessList = _.map(this.chessList, ch => ch.toString());
		info.playerList = _.map(this.playerList, p => p.toString());
		info.skillList = this.currChess ? _.map(this.currChess.skillList, sk => sk.toString()):[];
		info.currPlayerName = this.currPlayer ? this.currPlayer.name : undefined;
		info.currChessId = this.currChess ? this.currChess.id : undefined;
		info.currSkillId = this.currSkill ? this.currSkill.id : undefined;

		return info;
	}

	///////
	getPlayerByName(pName: string): IPlayer {
		return _.find(this.playerList, p => p.name == pName);
	}


	getChessByPosi(posi: IPosition) {
		return _.find(this.chessList, ch => ch.posi.x == posi.x && ch.posi.y == posi.y);
	}

	private maxEnergy = conf.MAX_ENERGY;
	private activeRestEnergy = conf.ACTIVE_REST_ENERGY;
	private passiveRestEnergy = conf.PASSIVE_REST_ENERGY;





}

export default ChessBoard;