interface IPosition {
	x: number;
	y: number;
}


interface IBox {
	position: IPosition;
}

interface IChessBoard{
	boxList:IBox[];
	width:number;
	heigth:number;
}

interface IChess{
	type:ChessType;
}

interface ISkill{}

interface IRecord{

}

interface IRecordFilter{}

interface IRecordMgr{}

enum ChessType{
	footman,
	cavalry,
	minister,
	magic,
	king
}