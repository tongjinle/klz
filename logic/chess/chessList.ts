import  {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';

import Footman from './footman';
import Cavalry from './cavalry';
import King from './king';
import Knight from './knight';
import Magic from './magic';
import Minister from './minister';

let chessList = {
	[ChessType.footman]:Footman,
	[ChessType.cavalry]:Cavalry,
	[ChessType.king]:King,
	[ChessType.knight]:Knight,
	[ChessType.magic]:Magic,
	[ChessType.minister]:Minister
	
};

export default chessList;