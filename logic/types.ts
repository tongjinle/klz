export interface IPosition {
	x: number;
	y: number;
}




export interface IBox {
	position: IPosition;
}

export interface IChessBoard {
	boxList: IBox[];
	chessList: IChess[];
	width: number;
	height: number;
	status:ChessBoardStatus;
	// 双方选手
	playerList: IPlayer[];
}

export interface IChess {
	id: number;
	color: ChessColor;
	type: ChessType;
	posi: IPosition;
	hp: number;
	status: ChessStatus;
	skillList: ISkill[];
	chessBoard: IChessBoard;
	getMoveRange: () => IPosition[];
	getCastRange: (skt: SkillType) => IPosition[];
	round: () => void;
	move: (posiTarget: IPosition) => void;
	cast: (skType: SkillType, posiTarget: IPosition) => void;
	rest: () => void;
	dead: () => void;

}

export interface ISkill {
	id: number;
	owner: IChess;
	type: SkillType;
	getCastRange: () => IPosition[];
	effect: (posiTarget: IPosition) => void;
	maxcd: number;
	cd: number;
	cooldown: () => void;
}

export interface IEffect {
	(sk: ISkill, chBoard: IChessBoard, posi: IPosition): void
}

export interface IMoveRecord {
	chSource: IChess,
	posiTarget: IPosition,
	data?: any
}

export interface IEffectRecord {
	chSource: IChess;
	chTarget?: IChess;
	skillType: SkillType;
	data?: any
}

export interface IRecord {
	recoType: RecordType,
	reco: IEffectRecord
}

export interface IRecordFilter { }

export interface IRecordMgr { }

export interface IRangeGen {
	(posi: IPosition): IPosition[];
}

export interface IMap{
	chessList:{chType:ChessType,color:ChessColor,posi:IPosition}[],
	width:number,
	height:number
}


//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
export interface IAsk{
	type:AskType,
	data?:any
}

export interface IAnswer{
	type:AskType,
	data?:any
}

export interface IPlayer{
	name:string;
	color:ChessColor;
	status:PlayerStatus;
	energy:number;
}


export interface IGame{
	create():void;
	round():IPlayer;
	answer(ask:IAsk):IAnswer;
	addPlayer(username:string):void;
	removePlayer(username:string):void;
}


//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

export enum ChessColor {
	red,
	black
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
	beforeMove,
	beforeCast,
	rest
}

export enum PlayerStatus{
	// 未准备好
	notReady,
	// 准备好
	ready,
	// 等待
	waiting,
	// 行棋中
	thinking,

}

export enum ChessBoardStatus{
	beforeStart,
	red,
	black,
	gameOver
}


export enum SkillType {
	attack,
	heal
}


export enum RecordType {
	round,
	move,
	cast,
	rest
}

export enum AskType{
	selectChess,
	unSelectChess,
	selectPosition,
	confirmPosition,
	selectSkill,
	unSelectSkill,
	rest,
	giveup

}