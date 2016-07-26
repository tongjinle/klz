import  {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';

import Footman from './footman';
import Cavalry from './cavalry';

let chessList = {
	[ChessType.footman]:Footman,
	[ChessType.cavalry]:Cavalry
	
};

export default chessList;