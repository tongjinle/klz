/// <reference path="../typings/index.d.ts" />
import _ = require('underscore');

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