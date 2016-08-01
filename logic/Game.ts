import {ChessBoardStatus, IMap, IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from './types';
import * as api from './api';
import maps from './maps';

class Game {
	// 属性
	// ***************************************************

	// 棋盘
	chBoard: IChessBoard;
	// 记录
	recoList: IRecord[];

	// 方法
	// ***************************************************
	// 初始化游戏
	// 默认的mapName为默认
	init(mapName: string = 'normal') {
		let map: IMap = maps[mapName];

		this.chBoard = {
			boxList: [],
			chessList: [],
			width: map.width,
			height: map.height,
			status: ChessBoardStatus.beforeStart,
			playerList: []
		};
		_.each(map.chessList, d => {
			let ch = api.chessApi.create(d.chType);
			api.chessApi.setColor(ch, d.color);
			api.chessApi.setPosition(ch, d.posi);

			this.chBoard.chessList.push(ch);
		});

	}


	// 增加选手
	addPlayer(pName:string):boolean{
		const MAX_PLAYER_COUNT =2;
		let pList = this.chBoard.playerList;
		let color :ChessColor;
		if(pList.length==2){
			return false;
		}else if(pList.length ==1){
			color = _.find(pList,p=>p.color ==ChessColor.red)?ChessColor.black:ChessColor.red;
			let p :IPlayer = {
				name:pName,
				color,
				status:PlayerStatus.notReady,
				energy:3
			};
		}
		return true;
	}

	// 删除选手
	removePlayer(pName:string):boolean{
		let pList = this.chBoard.playerList;
		if(_.find(pList,p=>p.name == pName)){
			pList = _.filter(pList,p=>p.name!=pName);
			return true;
		}
		return false;
	}

	// 选手确定状态
	// 开始游戏
	// 选手选择棋子
	// 选手移动棋子
	// 选手选择技能
	// 选手选择技能目标
	// 选手休息
	// 选手投降
	// 胜负判断


}