import  {IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,     IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../types';

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