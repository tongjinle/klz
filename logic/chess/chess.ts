/// <reference path="../../typings/index.d.ts" />
import _ = require('underscore');
export class Chess implements IChess {
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

	constructor() {
		this.id = parseInt(_.uniqueId());
	}
}