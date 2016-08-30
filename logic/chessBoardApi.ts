/// <reference path="../typings/index.d.ts" />
import  {IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from './types';

import _ = require('underscore');



// 位置相关
// 是否在棋盘中
export function isInChessBoard(chBoard: IChessBoard, posi: IPosition): boolean {
	let rst: boolean = true;
	rst = rst && (posi.x >= 0 && posi.x < chBoard.width && posi.y >= 0 && posi.y <= chBoard.height);
	return rst;
}


export function getChessByPosi(chBoard: IChessBoard, posi: IPosition): IChess {
	let ch: IChess;
	return ch;
}

export function addChess(chBoard: IChessBoard, ch: IChess): void {
	if (!chBoard) {
		throw "chessBoard error -- chessBoard not init";
	}
	if (!ch) {
		throw "chessBoard error -- chess not init";
	}
	if (_.include(chBoard.chessList, ch)) {
		throw "chessBoard error -- chess already exist";
	}
	if (_.find(chBoard.chessList, (chExist) => { chExist.posi.x == ch.posi.x && chExist.posi.y == ch.posi.y })) {
		throw "chessBoard error -- postion is used"
	};
	chBoard.chessList.push(ch);
}