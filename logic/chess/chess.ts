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
	round: () => void;
	move: (posiTarget: IPosition) => void;
	cast: (skType: SkillType, posiTarget: IPosition) => void;
	rest: () => void;
	dead: () => void;

	protected getMoveRangeOnPurpose: () => IPosition[];

	private inChessBoardFilter: (posi: IPosition) => boolean = posi => api.rangeApi.isInChessBoard(this.chessBoard, posi);

	constructor() {
		this.id = parseInt(_.uniqueId());

		this.round = () => {
			api.chessApi.setStatus(this, ChessStatus.beforeMove);
		};

		// 移动
		this.move = (posiTarget) => {
			api.chessApi.move(this, this.chessBoard, posiTarget);
			api.chessApi.setStatus(this, ChessStatus.beforeCast);
		};

		// 获得可以移动的坐标列表
		this.getMoveRange = () => _(this.getMoveRangeOnPurpose())
			.filter(this.inChessBoardFilter);

		// 获取可以施放技能的格子
		this.getCastRange = (skt) => _(_.find(this.skillList, sk => sk.type == skt).getCastRange())
			.filter(this.inChessBoardFilter);

		// 施放技能
		this.cast = (skt, posi) => {
			let sk: ISkill = _.find(this.skillList, sk => sk.type == skt);
			api.skillApi.cast(sk, sk.owner.chessBoard, posi);
		};

		this.rest = () => {
			this.status = ChessStatus.rest;
		};

		this.dead = ()=>{

		}
	}
}