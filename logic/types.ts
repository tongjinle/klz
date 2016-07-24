interface IPosition {
	x: number;
	y: number;
}




interface IBox {
	position: IPosition;
}

interface IChessBoard {
	boxList: IBox[];
	chessList: IChess[];
	width: number;
	heigth: number;
}

interface IChess {
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

interface ISkill {
	id: number;
	owner: IChess;
	type: SkillType;
	getCastRange: () => IPosition[];
	effect: (posiTarget: IPosition) => void;
	maxcd: number;
	cd: number;
	cooldown: () => void;
}

interface IEffect {
	(sk: ISkill, chBoard: IChessBoard, posi: IPosition): void
}

interface IMoveRecord {
	chSource: IChess,
	posiTarget: IPosition,
	data?: any
}

interface IEffectRecord {
	chSource: IChess;
	chTarget?: IChess;
	skillType: SkillType;
	data?: any
}

interface IRecord {
	recoType: RecordType,
	reco: IEffectRecord
}

interface IRecordFilter { }

interface IRecordMgr { }

interface IRangeGen {
	(posi: IPosition): IPosition[];
}


//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
interface IAsk{

}

interface IAnswer{

}

interface IPlayer{
	name:string;
	color:ChessColor;
	status:PlayerStatus;
}


interface IGame{
	create():void;
	round():void;
	answer(ask:IAsk):IAnswer;

}


//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

enum ChessColor {
	red,
	black
}

enum ChessType {
	footman,
	cavalry,
	minister,
	magic,
	king
}

// move之后可以cast
// cast之后,就rest
enum ChessStatus {
	beforeMove,
	beforeCast,
	rest
}

enum PlayerStauts{
	waiting,
	thinking,
	// done是整局下完
	done
}


enum SkillType {
	attack,
	heal
}


enum RecordType {
	round,
	move,
	cast,
	rest
}

