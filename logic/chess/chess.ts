/// <reference path="../../typings/index.d.ts" />

class Chess implements IChess {
	id:number;
	color:ChessColor;
	type:ChessType;
	posi:IPosition;
	status:ChessStatus;
	skillList:ISkill[];
	move:(posiTarget:IPosition)=>void;
	cast:(skillName:string)=>void;
	rest:()=>void;

	constructor(){
		this.id = parseInt(_.uniqueId());
	}
}