import { ChessType, ChessColor, IPosition, SkillType } from "./types";

// 设置地图名字
export type SetMapNameRecord = { mapName: string };

// 设置地图种子的记录格式
export type SetMapSeedRecord = {
  seed: number;
};
// 设置地图尺寸的记录格式
export type SetMapSizeRecord = {
  width: number;
  height: number;
};

// 设置地图棋子的记录格式
export type SetMapChessRecord = {
  chessList: {
    chessType: ChessType;
    color: ChessColor;
    position: IPosition;
  }[];
};

// 增加选手的记录格式
export type AddPlayerRecord = {
  red: string;
  black: string;
};

// 增加棋子的记录格式
export type AddChessRecord = {
  chessType: ChessType;
  chessColor: ChessColor;
  position: IPosition;
};

// 删除棋子的记录格式
export type RemoveChessRecord = {
  position: IPosition;
};

// 选择棋子的记录格式
export type ChooseChessRecord = { position: IPosition };

// 移动棋子的记录格式
export type MoveChessRecord = { position: IPosition };

// 选择技能的记录格式
export type ChooseSkillRecord = { skillType: SkillType };

// 使用技能的记录格式
export type CastSkillRecord = { position: IPosition };
