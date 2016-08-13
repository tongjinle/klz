export interface IPosition {
	x: number;
	y: number;
}





export interface IBox {
	position: IPosition;
}

export interface IChessBoard {
	seed:number;
	boxList: IBox[];
	chessList: IChess[];
	width: number;
	height: number;
	status: ChessBoardStatus;
	// 双方选手
	playerList: IPlayer[];

	readMap(mapName:string):void;
	setMapSeed(seed:number):void;
	setMapSize(width:number,height:number):void;
	setMapChess(chessList:{ chType: ChessType, color: ChessColor, posi: IPosition }[]):void;
	addPlayer(pName: string): boolean;
	removePlayer(pName: string): boolean;
	addChess(ch:IChess):boolean;
	removeChess(ch:IChess):boolean;
	ready(pName: string, status: PlayerStatus): boolean;
	round(pName?: string);
	getActiveChessList():IChess[];
	chooseChess(ch: IChess);
	unChooseChess(ch:IChess);
	moveChess(posi: IPosition);
	chooseSkill(skType: SkillType);
	chooseSkillTarget(posi: IPosition);

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
	status: ChessStatus;
	skillList: ISkill[];
	chBoard: IChessBoard;
	getMoveRange: () => IPosition[];
	getCastRange: (skt: SkillType) => IPosition[];
	round: () => void;
	move: (posiTarget: IPosition) => void;
	cast: (skType: SkillType, posiTarget: IPosition) => void;
	rest: () => void;
	dead: () => void;
	energy: number;
	canCastSkillList:ISkill[];


}

export interface ISkill {
	id: number;
	owner: IChess;
	type: SkillType;
	getCastRange: () => IPosition[];
	cast: (posiTarget: IPosition) => void;
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
	action:string;
	data:any;
}

export interface IRecordFilter { }

export interface IRecordMgr { }

export interface IRangeGen {
	(posi: IPosition): IPosition[];
}

export interface IMap {
	chessList: { chType: ChessType, color: ChessColor, posi: IPosition }[],
	width: number,
	height: number,
	seed:number
}

export interface IRepRecord{
	action:string;
	data:any;
}


//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
export interface IAsk {
	type: AskType,
	data?: any
}

export interface IAnswer {
	type: AskType,
	data?: any
}

export interface IPlayer {
	name: string;
	color: ChessColor;
	status: PlayerStatus;
	chStatus: ChessStatus;
	energy: number;
}


export interface IGame {
	create(): void;
	round(): IPlayer;
	answer(ask: IAsk): IAnswer;
	addPlayer(username: string): void;
	removePlayer(username: string): void;
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

export enum AskType {
	selectChess,
	unSelectChess,
	selectPosition,
	confirmPosition,
	selectSkill,
	unSelectSkill,
	rest,
	giveup

}
