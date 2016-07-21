interface IPosition {
	x: number;
	y: number;
}




interface IBox {
	position: IPosition;
}

interface IChessBoard {
	boxList: IBox[];
	width: number;
	heigth: number;
}

interface IChess {
	id: number;
	color: ChessColor;
	type: ChessType;
	posi: IPosition;
	status: ChessStatus;
	skillList: ISkill[];
	getMoveRange: () => IPosition[];
	move: (posiTarget: IPosition) => void;
	cast: (skillName: string) => void;
	rest: () => void;

}

interface ISkill {
	name: string;
	getCastRange: () => IPosition[];
	effect: (posiTarget: IPosition) => void;
	maxcd: number;
	cd: number;
	cooldown: () => void;
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