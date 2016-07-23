interface IPosition {
	x: number;
	y: number;
}




interface IBox {
	position: IPosition;
}

interface IChessBoard {
	boxList: IBox[];
	chessList:IChess[];
	width: number;
	heigth: number;
}

interface IChess {
	id: number;
	color: ChessColor;
	type: ChessType;
	posi: IPosition;
	hp:number;
	status: ChessStatus;
	skillList: ISkill[];
	chessBoard:IChessBoard;
	getMoveRange: () => IPosition[];
	getCastRange:(skt:SkillType)=>IPosition[];
	move: (posiTarget: IPosition) => void;
	cast: (skillName: string,posiTarget:IPosition) => void;
	rest: () => void;

}

interface ISkill {
	id:number;
	owner:IChess;
	type:SkillType;
	getCastRange: () => IPosition[];
	effect: (posiTarget: IPosition) => void;
	maxcd: number;
	cd: number;
	cooldown: () => void;
}

interface IEffect{
	(sk:ISkill,chBoard:IChessBoard,posi:IPosition):void
}

interface IRecord {

}

interface IRecordFilter { }

interface IRecordMgr { }

interface IRangeGen {
	(posi: IPosition): IPosition[];
}


//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

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


enum SkillType{
	attack
}