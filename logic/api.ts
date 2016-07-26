/// <reference path="../typings/index.d.ts" />

import  {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from './types';
import * as rangeApi from './rangeApi';
import * as chessApi from './chessApi';
import * as skillApi from './skillApi';



export {rangeApi, chessApi, skillApi};




// 读取记录
export function readRecord(mgr: IRecordMgr, filter: IRecordFilter): any {

}

// 写入记录
export function writeRecord(mgr: IRecordMgr, reco: IRecord): void {

}



