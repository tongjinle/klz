export interface IPosition {
	x: number;
	y: number;
}





export interface IBox {
	position: IPosition;
}

export interface IChessBoard {
	seed: number;
	roundIndex: number;
	boxList: IBox[];
	chessList: IChess[];
	width: number;
	height: number;
	status: ChessBoardStatus;
	// 双方选手
	playerList: IPlayer[];

	// change表
	chgList: IChange<{}>[];

	readMap(mapName: string): void;
	setMapSeed(seed: number): void;
	setMapSize(width: number, height: number): void;
	setMapChess(chessList: { chType: ChessType, color: ChessColor, posi: IPosition }[]): void;
	addPlayer(pName: string): boolean;
	removePlayer(pName: string): boolean;
	addChess(ch: IChess): boolean;
	removeChess(ch: IChess): boolean;
	ready(pName: string, status: PlayerStatus): boolean;
	round(pName?: string);
	rest(): void;
	getActiveChessList(): IChess[];
	chooseChess(ch: IChess): void;
	unChooseChess(): void;
	moveChess(posi: IPosition): void;
	chooseSkill(skType: SkillType): void;
	unChooseSkill(): void;
	chooseSkillTarget(posi: IPosition): void;
	getLastChange(): IChange<{}>;
	getPlayerByName(pName: string): IPlayer;
	getChessByPosi(posi: IPosition): IChess;
	judge(): ChessBoardJudge;
	currPlayer: IPlayer;
	currChess: IChess;
	currSkill: ISkill;
}

export interface IChess {
	id: number;
	color: ChessColor;
	type: ChessType;
	posi: IPosition;
	hp: number;
	maxhp: number;
	status: ChessStatus;
	skillList: ISkill[];
	addSkill(sk: ISkill): void;
	chBoard: IChessBoard;
	getMoveRange: () => IPosition[];
	getCastRange: (skt: SkillType) => IPosition[];
	round: () => void;
	move: (posiTarget: IPosition) => void;
	cast: (skType: SkillType, posiTarget: IPosition) => void;
	rest: () => void;
	dead: () => void;
	energy: number;
	canCastSkillList: ISkill[];
}

export interface ISkill {
	id: number;
	owner: IChess;
	type: SkillType;
	getCastRange(): IPosition[];
	cast(posiTarget: IPosition): void;
	maxcd: number;
	cd: number;
	cooldown: () => void;
}

export interface IMap {
	chessList: { chType: ChessType, color: ChessColor, posi: IPosition }[],
	width: number,
	height: number,
	seed: number
}

export interface IPlayer {
	name: string;
	color: ChessColor;
	status: PlayerStatus;
	chStatus: ChessStatus;
	energy: number;
}




// change
export interface IChange<T extends {}> {
	round: number,
	type: ChangeType,
	detail: T
}

export interface IPositionChange extends IChange<{
	abs:IPosition,
	rela:IPosition
}> {

}

export interface IEnergyChange extends IChange<{
	restType:RestType,
	abs:number,
	rela:number
}> {

}

export interface IHpChange extends IChange<{
	sourceChessId:number,
	targetChessId:number,
	abs:number,
	rela:number
}> {

}

//  replay
export interface IRecord {
	round: number;
	action: ActionType;
	data: any;
}




// http data protocol
export interface IRoomInfo {
	roundIndex: number,
	width: number,
	height: number,
	status: number,
	playerList: {
		playerName: string,
		status: number,
		chStatus: number
	}[],
	chessList: {
		id: number,
		color: ChessColor,
		type: ChessType,
		posi: IPosition,
		hp: number,
		maxhp: number,
		status: ChessStatus,
		energy: number
	}[],
	skillList: {
		id: number,
		chessId: number,
		type: SkillType
		maxcd: number,
		cd: number,
	}[],
	currPlayerName: string,
	currChessId: number,
	currSkillId: number
}
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

export enum ChessColor {
	red,
	black
}

export enum ChessRelationship {
	firend,
	enemy
}

export enum ChessType {
	footman,
	knight,
	cavalry,
	minister,
	magic,
	king
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
	setMapSeed,
	setMapSize,
	setMapChess,
	readMap,
	addChess,
	removeChess,
	chooseChess,
	moveChess,
	chooseSkill,
	castSkill,
	rest,
	round,
	addPlayer
}

export enum ChangeType {
	position,
	hp,
	energy
}


export enum RestType{
	active,
	passive
}


/////////////////////////////////////////////////////////////
