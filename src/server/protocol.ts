import { IPosition, SkillType } from "../logic/types";
import { RoomStatus } from "./room";

interface IRoomInfo {}

// 聊天数据格式
export type ChatRequest = { text: string };
export type ChatResponse = { text: string };

// 游戏房间列表数据格式
export type RoomListRequest = {};
export type RoomListResponse = { title: string; status: RoomStatus };

// 进入房间
export type RoomEnterRequest = { id: string };
export type RoomEnterResponse = IRoomInfo;

// 离开房间
export type RoomLeaveRequest = {};
export type RoomLeaveResponse = {};

// 准备
export type ReadyRequest = {};
export type ReadyResponse = {};

// 反准备
export type UnReadyRequest = {};
export type UnReadyResponse = {};

// 选择棋子
export type ChooseChessRequest = { position: IPosition };

// 反选择棋子
export type UnChooseChessRequest = {};

// 移动棋子
export type MoveChessRequest = { position: IPosition };

// 选择技能
export type ChooseSkillRequest = { skillType: SkillType };

// 反选择技能
export type UnChooseSkill = {};

// 施放技能
export type CastSkill = { position: IPosition };
