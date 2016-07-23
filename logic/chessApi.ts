/// <reference path="../typings/index.d.ts" />

import chessList from './chess/chessList';

// 创建棋子
export function create(type: ChessType): IChess {
	let ch: IChess = new chessList[type];
	// id
	ch.id = parseInt(_.uniqueId());
	// type
	ch.type = type;
	// status
	ch.status = ChessStatus.rest;

	return ch;
}

// 设置颜色(阵营)
export function setColor(ch: IChess, color: ChessColor): void {
	ch.color = color;
}

// 设置位置
export function setPosition(ch: IChess, posi: IPosition): void {
	ch.posi = _.clone(posi);
}




// 找到可以行走的范围
export function getMoveRange(ch: IChess, chBoard: IChessBoard): IPosition[] {
	let posiList: IPosition[] = [];
	return posiList;
}

// 移动棋子
export function move(ch: IChess, chBoard: IChessBoard, posiTarget: IPosition): IRecord {
	let re: IRecord;
	return re;
}


export function setStatus(ch: IChess, status: ChessStatus): void {
	ch.status = status;
	// todo
	
}