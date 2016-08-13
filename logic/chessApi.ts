/// <reference path="../typings/index.d.ts" />
import  {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from './types';
import _ = require("underscore");

import chessList from './chess/chessList';


// 创建棋子
export function create(type: ChessType): IChess {
	let ch: IChess = new chessList[type]();
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
	ch.posi = ch.posi || {x:-1,y:-1};

	ch.posi.x =posi.x;
	ch.posi.y = posi.y;
}

export function setHp(ch: IChess, hp: number): void {
	ch.hp = hp;
}




// 找到可以行走的范围
export function getMoveRange(ch: IChess, chBoard: IChessBoard): IPosition[] {
	let posiList: IPosition[] = [];
	return posiList;
}

// 移动棋子
export function move(ch: IChess, chBoard: IChessBoard, posiTarget: IPosition): IRecord {
	let re: IRecord;
	setPosition(ch,posiTarget);
	return re;
}


export function setStatus(ch: IChess, status: ChessStatus): void {
	ch.status = status;
	// todo
}
