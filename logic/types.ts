export interface IPosition {
	x: number;
	y: number;
}





export interface IBox {
	position: IPosition;
}

export interface IChessBoardInfo{
	id:number;
	mapName:string;
	seed: number;
	roundIndex: number;
	width: number;
	height: number;
	status: ChessBoardStatus;
	winColor:ChessColor;
	// 双方选手
	chessList: IChessInfo[];
	playerList: IPlayerInfo[];
	skillList:ISkillInfo[];

	currPlayerName: string;
	currChessId: number;
	currSkillId: number;
}

export interface IChessBoard {
	id:number;
	mapName:string;
	seed: number;
	roundIndex: number;
	boxList: IBox[];
	chessList: IChess[];
	width: number;
	height: number;
	status: ChessBoardStatus;
	winColor:ChessColor;
	// 双方选手
	playerList: IPlayer[];

	currPlayer: IPlayer;
	currChess: IChess;
	currSkill: ISkill;


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
	getPlayerByName(pName: string): IPlayer;
	getChessByPosi(posi: IPosition): IChess;
	judge(): ChessBoardJudge;
	

	// 数据持久化
	parse(data:string):void;
	toString():IChessBoardInfo;
}

export	interface IChessInfo{
	id: number;
	color: ChessColor;
	type: ChessType;
	posi: IPosition;
	hp: number;
	maxhp: number;
	status: ChessStatus;
	energy: number;
	chBoardId: number;
}

export interface IChess {
	id: number;
	color: ChessColor;
	type: ChessType;
	posi: IPosition;
	hp: number;
	maxhp: number;
	status: ChessStatus;
	energy: number;
	chBoard: IChessBoard;
	
	skillList: ISkill[];
	addSkill(sk: ISkill): void;
	getMoveRange: () => IPosition[];
	getCastRange: (skt: SkillType) => IPosition[];
	round: () => void;
	move: (posiTarget: IPosition) => void;
	cast: (skType: SkillType, posiTarget: IPosition) => void;
	rest: () => void;
	dead: () => void;
	canCastSkillList: ISkill[];

	
	toString():IChessInfo;
}

export interface ISkillInfo{
	id: number;
	ownerId: number;
	type: SkillType;
	maxcd: number;
	cd: number;
}

export interface ISkill {
	id: number;
	owner: IChess;
	type: SkillType;
	maxcd: number;
	cd: number;
	
	getCastRange(): IPosition[];
	cast(posiTarget: IPosition): void;
	cooldown: () => void;

	
	toString():ISkillInfo;
}

export interface IMap {
	chessList: { chType: ChessType, color: ChessColor, posi: IPosition }[],
	width: number,
	height: number,
	seed: number
}


export interface IPlayerInfo{
	name: string;
	color: ChessColor;
	status: PlayerStatus;
	chStatus: ChessStatus;
	energy: number;
}

export interface IPlayer {
	name: string;
	color: ChessColor;
	status: PlayerStatus;
	chStatus: ChessStatus;
	energy: number;


	toString():IPlayerInfo;
}




// change
export interface IChange<T extends {}> {
	round: number,
	playerName:string,
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
