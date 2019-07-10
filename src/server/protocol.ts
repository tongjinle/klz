import {
  IPosition,
  SkillType,
  ChessColor,
  IChessBoardInfo
} from "../logic/types";
import { IRoomInfo } from "./roomMgr";

interface IEffect {}

type baseResponse = { code: number; message?: string };

// 聊天数据格式
export type ChatRequest = { text: string };
export type ChatResponse = {} & baseResponse;
export type ChatNotify = { text: string };

// 游戏房间列表数据格式
export type LobbyRequest = {};
export type LobbyResponse = {
  code: number;
  list: IRoomInfo[];
};

// 进入房间
export type EnterRoomRequest = { roomId: string };
export type EnterRoomResponse = { info?: IRoomInfo } & baseResponse;
export type EnterRoomNotify = { info: IRoomInfo };

// 离开房间
export type LeaveRoomRequest = {};
export type LeaveRoomResponse = {} & baseResponse;
export type LeaveRoomNotify = { userId: string };

// 准备
export type ReadyRequest = {};
export type ReadyResponse = {} & baseResponse;
export type ReadyNotify = { userId: string };

// 反准备
export type UnReadyRequest = {};
export type UnReadyResponse = {} & baseResponse;
export type UnReadyNotify = { userId: string };

// 游戏开始通知
export type GameStartNotify = { info: IChessBoardInfo };

// 获取可以选择的棋子
export type ActiveChessListRequest = {};
export type ActiveChessListResponse = { chessIdList: string[] };

// 选择棋子
export type ChooseChessRequest = { position: IPosition };
export type ChooseChessResponse = {} & baseResponse;
export type ChooseChessNotify = { userId: string; position: IPosition };

// 反选择棋子
export type UnChooseChessRequest = {};
export type UnChooseChessResponse = {} & baseResponse;
export type UnChooseChessNotify = { userId: string; position: IPosition };

// 移动棋子
export type MoveChessRequest = { position: IPosition };
export type MoveChessResponse = {} & baseResponse;
export type MoveChessNotify = { userId: string; position: IPosition };

// 获取可以选择的技能
export type ActiveSkillListRequest = {};
export type ActiveSkillListResponse = { skillIdList: string[] };

// 选择技能
export type ChooseSkillRequest = { skillType: SkillType };
export type ChooseSkillResponse = {} & baseResponse;
export type ChooseSkillNotify = { userId: string; skillType: SkillType };

// 反选择技能
export type UnChooseSkillRequest = {};
export type UnChooseSkillResponse = {} & baseResponse;
export type UnChooseSkillNotify = { userId: string; skillType: SkillType };

// 施放技能
export type CastSkillRequest = { position: IPosition };
export type CastSkillResponse = { effect: IEffect } & baseResponse;
export type CastSkillNotify = { effect: IEffect } & baseResponse;

// 投降
export type SurrenderRequest = {};
export type SurrenderResponse = {} & baseResponse;
export type SurrenderNotify = { userId: string };

// 游戏结束
export type GameOverNotify = { winColor: ChessColor };
