/// <reference path="../../typings/index.d.ts" />
import _ = require('underscore');
import * as api from '../api';
import {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';




export default class Chess implements IChess {
	id: number;
	color: ChessColor;
	type: ChessType;
	posi: IPosition;
	hp: number;
	status: ChessStatus;
	skillList: ISkill[];
	energy: number;
	chBoard: IChessBoard;


	// 获得可以移动的坐标列表
	protected getMoveRangeOnPurpose: () => IPosition[];
	getMoveRange(): IPosition[] {
		return _(this.getMoveRangeOnPurpose())
			.filter(posi => this.inChessBoardFilter(posi));
	};
	// 获取可以施放技能的格子
	getCastRange(skt: SkillType): IPosition[] {
		return _(_.find(this.skillList, sk => sk.type == skt).getCastRange())
			.filter(posi => this.inChessBoardFilter(posi));
	};
	// 施放技能
	cast(skType: SkillType, posiTarget: IPosition): void {

		this.cast = (skt, posi) => {
			let sk: ISkill = _.find(this.skillList, sk => sk.type == skt);
			api.skillApi.cast(sk, sk.owner.chBoard, posi);
		};
	};
	// 休息
	rest():void{
		this.status = ChessStatus.rest;
	};

	// 棋子死亡
	dead () : void{

	};

	//
	round(): void {
		api.chessApi.setStatus(this, ChessStatus.beforeChoose);
	};
	// 移动
	move(posiTarget: IPosition): void {
		api.chessApi.move(this, this.chBoard, posiTarget);

		// 如果有技能可以cast,状态为beforeCast
		if (this.canCastSkillList.length) {
			this.status = ChessStatus.beforeCast;
		} else {
			// 否则直接进入休息
			this.rest();
		}

	};

	public get canCastSkillList(): ISkill[] {
		if ([ChessStatus.beforeMove, ChessStatus.beforeCast].indexOf(this.status) >= 0) {
			return _.filter(this.skillList, sk => {
				return this.getCastRange(sk.type).length > 0;
			});
		}
		return [];
	}


	// 棋盘边界过滤器
	private inChessBoardFilter: (posi: IPosition) => boolean = posi => api.chessBoardApi.isInChessBoard(this.chBoard, posi);

	constructor() {
		this.id = parseInt(_.uniqueId());
		this.status = ChessStatus.beforeChoose;
		this.skillList = [];
	}
}