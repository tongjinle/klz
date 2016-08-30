/// <reference path="../typings/index.d.ts" />

import  {IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from './types';
import _ = require("underscore");
import * as chessBoardApi from './chessBoardApi';
import * as chessApi from './chessApi';
import skillList from './skill/skillList';

export function create(skt: SkillType): ISkill {
	let sk: ISkill = new skillList[skt]();

	sk.id = parseInt(_.uniqueId());
	return sk;
}

export function setOwner(sk: ISkill, ch: IChess) {
	sk.owner = ch;
}



export function canCast(sk: ISkill): boolean {
	return sk.cd == 0;
}

export function cast(sk: ISkill, chBoard: IChessBoard, posi: IPosition) {
	
	setCd(sk, sk.maxcd);
}




export function setCd(sk: ISkill, cd: number): void {
	sk.cd = cd;
}



// 找到技能可以施放的目标点
export function getCastRange(sk: ISkill, chBoard: IChessBoard, posiSource: IPosition): IPosition[] {
	let posiList: IPosition[] = [];
	return posiList;
}

// 找到技能在目标点施放,会影响到的目标格子
export function getCastEffectRange(sk: ISkill, chBoard: IChessBoard, posiSource: IPosition, posiTarget: IPosition) {
	let posiList: IPosition[] = [];
	return posiList;
}

