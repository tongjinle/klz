/// <reference path="../typings/index.d.ts" />


import ChessBoard from './chessBoard/chessBoard';
import {ActionType, IRecord, SkillType, ChessColor, ChessType, IPosition, IChess} from './types';
import Chess from './chess/chess';
import chessList from './chess/chessList';
import _ = require("underscore");



export default class Replay {
	constructor() {
		this.recoList = [];

	}
	seed: number;
	chBoard: ChessBoard;
	recoList: IRecord[];
	parse(reco: IRecord): void {
		this.chBoard = this.chBoard || new ChessBoard();

		this.parseDict[reco.action](reco.data);
		this.recoList.push(reco);
	}

	query(action: ActionType, condi: { [key: string]: any }): IRecord[] {
		let recoList: IRecord[];
		recoList = _.filter(this.recoList, reco =>
			(action ? reco.action == action : true) &&
			(condi ? _.all(condi, (v, k) => reco[k] == v) : true)
		);
		return recoList;
	}


	private parseDict: { [action: number]: (data: {}) => void } = {
		[ActionType.setMapSeed]: (data: { seed: number }) => {
			this.chBoard.setMapSeed(data.seed);
		},
		[ActionType.setMapSize]: (data: { width: number, height: number }) => {
			this.chBoard.setMapSize(data.width, data.height);
		},

		[ActionType.setMapChess]: (data: { chessList: { chType: ChessType, color: ChessColor, posi: IPosition }[] }) => {
			this.chBoard.setMapChess(data.chessList);
		},

		[ActionType.readMap]: (data: { mapName: string, randomSeed: number }) => {
			this.chBoard.readMap(data.mapName);
			this.seed = data.randomSeed;
		},

		[ActionType.addChess]: (data: { chessType: ChessType, position: IPosition, chessColor: ChessColor }) => {
			let ch: IChess = new chessList[data.chessType]();
			ch.color = data.chessColor;
			ch.posi = data.position;
			this.chBoard.addChess(ch);
		},
		[ActionType.removeChess]: (data: { position: IPosition }) => {
			this.chBoard.removeChess(this.chBoard.getChessByPosi(data.position));
		},
		[ActionType.chooseChess]: (data: { position: IPosition }) => {
			this.chBoard.currChess = this.chBoard.getChessByPosi(data.position);
		},
		[ActionType.moveChess]: (data: { position: IPosition }) => {
			let ch = this.chBoard.currChess;
			ch.posi = data.position;
		},
		[ActionType.chooseSkill]: (data: { skillType: SkillType }) => {
			let ch = this.chBoard.currChess;
			let sk = _.find(ch.skillList, sk => sk.type == data.skillType);
			this.chBoard.currSkill = sk;
		},
		[ActionType.castSkill]: (data: { position: IPosition }) => {
			let sk = this.chBoard.currSkill;
			sk.cast(data.position);
		},
		[ActionType.rest]: () => {
			this.chBoard.rest();
		}
	};



}










