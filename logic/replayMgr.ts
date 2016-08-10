/// <reference path="../typings/index.d.ts" />


import ChessBoard from './chessBoard/chessBoard';
import {ChessColor, ChessType,IPosition,IChess} from './types';
import Chess from './chess/chess';
import chessList from './chess/chessList';
import _ = require("underscore");


class ReplayMgr {
	randomSeed: number;
	chBoard: ChessBoard;
	parse(rep): void {

	}

	private parseDict: { [action: string]: (data: {}) => void } = {
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
		'selectSkill':()=>{}
	};

	constructor() {
		// code...
	}
}










