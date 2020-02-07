import Chess from "./chess/chess";

export interface IPosition {
  x: number;
  y: number;
}

export interface IBox {
  position: IPosition;
}

export interface IChessBoardInfo {
  id: string;
  mapName: string;
  seed: number;
  roundIndex: number;
  width: number;
  height: number;
  status: ChessBoardStatus;
  winColor: ChessColor;
  // 双方选手
  chessList: IChessInfo[];
  playerList: IPlayerInfo[];
  skillList: ISkillInfo[];

  currentPlayerName: string;
  currentChessId: string;
  currentSkillId: string;
}

export interface IChessInfo {
  id: string;
  color: ChessColor;
  type: ChessType;
  position: IPosition;
  hp: number;
  maxhp: number;
  status: ChessStatus;
  energy: number;
  chessBoardId: string;
}

export interface ISkillInfo {
  id: string;
  ownerId: string;
  type: SkillType;
  maxcd: number;
  cd: number;
}

export interface ISkill {
  id: number;
  owner: Chess;
  type: SkillType;
  maxcd: number;
  cd: number;

  getCastRange(): IPosition[];
  cast(posiTarget: IPosition): void;
  cooldown: () => void;

  toString(): ISkillInfo;
}

export interface IMap {
  chessList: { chessType: ChessType; color: ChessColor; position: IPosition }[];
  width: number;
  height: number;
  seed: number;
}

export interface IPlayerInfo {
  name: string;
  color: ChessColor;
  status: PlayerStatus;
  isChooseRest: boolean;
  energy: number;
}

// change
export interface IChange {
  round: number;
  playerName: string;
  type: ChangeType;
  data: UnionChange;
}

//  replay
export interface IRecord {
  round: number;
  actionType: ActionType;
  data: any;
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

export type ChessColor = "red" | "black";

export type ChessRelationship = "firend" | "enemy";

export type ChessType =
  | "footman"
  | "knight"
  | "cavalry"
  | "minister"
  | "magic"
  | "king";

// move之后可以cast
// cast之后,就rest
/** 棋子状态,被选择前|移动前|使用技能前|休息 */
export type ChessStatus = "beforeChoose" | "beforeMove" | "beforeCast" | "rest";

export type PlayerStatus = "ready" | "thinking" | "waiting" | "offline";

export type ChessBoardStatus =
  | "beforeStart"
  | "red"
  | "black"
  | "gameOver"
  | "offline";

// 棋局结果
export type ChessBoardJudge = "red" | "black" | "equal" | "none";

export type SkillType =
  | "emptySkill"
  | "attack"
  | "storm"
  | "crash"
  | "heal"
  | "purge"
  | "fire"
  | "nova"
  | "cleave";

export type ActionType =
  | "setMapSeed"
  | "setMapSize"
  | "setMapChess"
  | "readMap"
  | "addChess"
  | "removeChess"
  | "chooseChess"
  | "unChooseChess"
  | "moveChess"
  | "chooseSkill"
  | "unChooseSkill"
  | "castSkill"
  | "rest"
  | "round"
  | "addPlayer";

export type ChangeType = "position" | "hp" | "energy";

/**
 * hp的改变
 */
export type HpChange = {
  sourceChessId: string;
  targetChessId: string;
  skillId: string;
  abs: number;
  rela: number;
};

/**
 * Energy的改变
 */
export type EnergyChange = {
  abs: number;
  rela: number;
  restType: RestType;
};

export type PositionChange = {
  sourceChessId: string;
  abs: IPosition;
  rela: IPosition;
};

export type UnionChange = HpChange | EnergyChange | PositionChange;

/**
 * 休息方式
 */
export type RestType = "active" | "passive";

/////////////////////////////////////////////////////////////
