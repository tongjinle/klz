/// <reference path="../../typings/index.d.ts" />
import _ = require('underscore');
import * as api from '../api';



export class Chess implements IChess {
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
	move: (posiTarget: IPosition) => void;
	cast: (skillName: string, posiTarget: IPosition) => void;
	rest: () => void;

	protected getMoveRangeOnPurpose: () => IPosition[];

	private inChessBoardFilter: (posi: IPosition) => boolean = posi => api.rangeApi.isInChessBoard(this.chessBoard, posi);

	constructor() {
		this.id = parseInt(_.uniqueId());


		this.move = (posiTarget) => {
			api.chessApi.move(this, this.chessBoard, posiTarget);
		};

		// 获得可以移动的坐标列表
		this.getMoveRange = () => _(this.getMoveRangeOnPurpose())
			.filter(this.inChessBoardFilter);

		// 获取可以施放技能的格子
		this.getCastRange = (skt: SkillType) => _(_.find(this.skillList, sk => sk.type == skt).getCastRange())
			.filter(this.inChessBoardFilter);

		// 施放技能
	}
}