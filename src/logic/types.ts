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

  currPlayerName: string;
  currChessId: string;
  currSkillId: string;
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
  chStatus: ChessStatus;
  energy: number;
}

// change
export interface IChange<T extends {}> {
  round: number;
  playerName: string;
  type: ChangeType;
  detail: T;
}

export interface IPositionChange
  extends IChange<{
    abs: IPosition;
    rela: IPosition;
  }> {}

export interface IEnergyChange
  extends IChange<{
    restType: RestType;
    abs: number;
    rela: number;
  }> {}

export interface IHpChange
  extends IChange<{
    sourceChessId: number;
    targetChessId: number;
    abs: number;
    rela: number;
  }> {}

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

export enum ChessColor {
  red = "red",
  black = "black"
}

export enum ChessRelationship {
  firend,
  enemy
}

export enum ChessType {
  footman = "footman",
  knight = "knight",
  cavalry = "cavalry",
  minister = "minister",
  magic = "magic",
  king = "king"
}

// move之后可以cast
// cast之后,就rest
export enum ChessStatus {
  // 被选择前
  beforeChoose,
  // 移动前
  beforeMove,
  // 使用技能前
  beforeCast,
  rest
}

export enum PlayerStatus {
  // 未准备好
  notReady,
  // 准备好
  ready,
  // 等待
  waiting,
  // 行棋中
  thinking
}

export enum ChessBoardStatus {
  beforeStart,
  red,
  black,
  gameOver
}

// 棋局结果
export enum ChessBoardJudge {
  red,
  black,
  // 平局
  equal,
  // 无胜负
  none
}

export enum SkillType {
  emptySkill,
  attack,
  storm,
  crash,
  heal,
  purge,
  fire,
  nova,
  cleave
}

export enum ActionType {
  setMapSeed = "setMapSeed",
  setMapSize = "setMapSize",
  setMapChess = "setMapChess",
  readMap = "readMap",
  addChess = "addChess",
  removeChess = "removeChess",
  chooseChess = "chooseChess",
  unChooseChess = "unChooseChess",
  moveChess = "moveChess",
  chooseSkill = "chooseSkill",
  unChooseSkill = "unChooseSkill",
  castSkill = "castSkill",
  rest = "rest",
  round = "round",
  addPlayer = "addPlayer"
}

export enum ChangeType {
  position,
  hp,
  energy
}

export enum RestType {
  active,
  passive
}

/////////////////////////////////////////////////////////////
