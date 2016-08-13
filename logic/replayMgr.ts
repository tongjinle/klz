/// <reference path="../typings/index.d.ts" />


import ChessBoard from './chessBoard/chessBoard';
import {IRecord, SkillType, ChessColor, ChessType,IPosition,IChess} from './types';
import Chess from './chess/chess';
import chessList from './chess/chessList';
import _ = require("underscore");



export default class ReplayMgr {
	randomSeed: number;
	chBoard: ChessBoard;
	parse(rep:IRecord): void {
		this.parseDict[rep.action](rep.data);
	}

	private parseDict: { [action: string]: (data: {}) => void } = {
		'setMapSeed':(data:{seed:number})=>{
			this.chBoard.setMapSeed(data.seed);
		},
		'setMapSize':(data:{width:number,height:number})=>{
			this.chBoard.setMapSize(data.width,data.height);
		},

		'setMapChess':(data:{chessList:{ chType: ChessType, color: ChessColor, posi: IPosition }[]})=>{
			this.chBoard.setMapChess(data.chessList);
		},

		'readMap': (data: { mapName: string, randomSeed: number }) => {
			this.chBoard = new ChessBoard(data.mapName);
			this.randomSeed = data.randomSeed;
		},

		'addChess':(data:{chessType:ChessType,position:IPosition,chessColor:ChessColor})=>{
			let ch:IChess = new chessList[data.chessType]();
			ch.color = data.chessColor;
			ch.posi = data.position;
			this.chBoard.addChess(ch);
		},
		'removeChess':(data:{position:IPosition})=>{
			this.chBoard.removeChess(this.chBoard.getChessByPosi(data.position));
		},
		'selectChess':(data:{position:IPosition})=>{
			this.chBoard.currChess = this.chBoard.getChessByPosi(data.position);
		},
		'moveChess':(data:{position:IPosition})=>{
			let ch = this.chBoard.currChess;
			ch.posi = data.position;
		},
		'selectSkill':(data:{skillType:SkillType})=>{
			let ch = this.chBoard.currChess;
			let sk = _.find(ch.skillList,sk=>sk.type == data.skillType);
			this.chBoard.currSkill = sk;
		},
		'castSkill':(data:{position:IPosition})=>{
			let sk = this.chBoard.currSkill;
			sk.cast(data.position);
		},
		'rest':()=>{
			this.chBoard.rest();
		}
	};

	constructor() {
		this.chBoard = new ChessBoard();

	}
}










