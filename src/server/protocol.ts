import {
  IPosition,
  SkillType,
  ChessColor,
  IChessBoardInfo,
  IChange,
  UnionChange
} from "../logic/types";
import { IRoomInfo } from "./lobby";

interface IEffect {}

export type BaseResponse = { code: number; message?: string };

// 聊天数据格式
export type ChatRequest = { text: string };
export type ChatResponse = {} & BaseResponse;
export type ChatNotify = { text: string };

// 游戏房间列表数据格式
export type LobbyRequest = {};
export type LobbyResponse = {
  list: IRoomInfo[];
} & BaseResponse;

// 进入房间
export type EnterRoomRequest = { roomId: string };
export type EnterRoomResponse = { info?: IRoomInfo } & BaseResponse;
export type EnterRoomNotify = { info: IRoomInfo };

// 离开房间
export type LeaveRoomRequest = {};
export type LeaveRoomResponse = {} & BaseResponse;
export type LeaveRoomNotify = { userId: string };

// 准备
export type ReadyRequest = {};
export type ReadyResponse = {} & BaseResponse;
export type ReadyNotify = { userId: string };

// 反准备
export type UnReadyRequest = {};
export type UnReadyResponse = {} & BaseResponse;
export type UnReadyNotify = { userId: string };

// 游戏开始通知
export type GameStartNotify = { info: IChessBoardInfo };

// 获取可以选择的棋子
export type ActiveChessListRequest = {};
export type ActiveChessListResponse = { chessIdList: string[] } & BaseResponse;

// 选择棋子
export type ChooseChessRequest = { position: IPosition };
export type ChooseChessResponse = {} & BaseResponse;
export type ChooseChessNotify = { userId: string; position: IPosition };

// 反选择棋子
export type UnChooseChessRequest = {};
export type UnChooseChessResponse = {} & BaseResponse;
export type UnChooseChessNotify = { userId: string; position: IPosition };

// 反选择棋子
export type RangeRequest = {};
export type RangeResponse = { positionList: IPosition[] } & BaseResponse;

// 移动棋子
export type MoveChessRequest = { position: IPosition };
export type MoveChessResponse = {} & BaseResponse;
export type MoveChessNotify = {
  userId: string;
  chessId: string;
  position: IPosition;
};

// 获取可以选择的技能
export type ActiveSkillListRequest = {};
export type ActiveSkillListResponse = {
  skillTypeList: SkillType[];
} & BaseResponse;

// 选择技能
export type ChooseSkillRequest = { skillType: SkillType };
export type ChooseSkillResponse = {} & BaseResponse;
export type ChooseSkillNotify = { userId: string; skillType: SkillType };

// 反选择技能
export type UnChooseSkillRequest = {};
export type UnChooseSkillResponse = {} & BaseResponse;
export type UnChooseSkillNotify = { userId: string; skillType: SkillType };

// 施放技能
export type CastSkillRequest = { position: IPosition };
export type CastSkillResponse = {} & BaseResponse;
export type CastSkillNotify = { change: IChange } & BaseResponse;

// 投降
export type SurrenderRequest = {};
export type SurrenderResponse = {} & BaseResponse;
export type SurrenderNotify = { userId: string };

// 游戏结束
export type GameOverNotify = { winColor: ChessColor };

// 回合
export type RoundRequest = {};
export type RoundResponse = { round: number; userId: string } & BaseResponse;
export type RoundNotify = { round: number; userId: string };
