/// <reference path="../../typings/index.d.ts" />
import _ = require('underscore');
import * as api from '../api';
import {IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import chessList from './chessList';



export default class Chess implements IChess {
	id: number;
	color: ChessColor;
	type: ChessType;
	posi: IPosition;
	hp: number;
	maxhp:number;
	status: ChessStatus;
	skillList: ISkill[];
	energy: number;
	chBoard: IChessBoard;

	// 增加技能
	addSkill(sk:ISkill){
		this.skillList.push(sk);
		sk.owner = this;
	}

	// 获得可以移动的坐标列表
	protected getMoveRangeOnPurpose(): IPosition[] { return undefined };
	getMoveRange(): IPosition[] {
		return _(this.getMoveRangeOnPurpose())
			// 过滤掉不在棋盘中的
			.filter(posi => this.inChessBoardFilter(posi))
			// 过滤掉已经被占据的格子
			.filter(posi => this.hasChessFilter(posi))
			;
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
	rest(): void {
		this.status = ChessStatus.rest;
	};

	// 棋子死亡
	dead(): void {

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
	private inChessBoardFilter(posi: IPosition): boolean {
		return api.chessBoardApi.isInChessBoard(this.chBoard, posi);
	}

	// 已经占据的格子过滤器
	// 一个格子里不能有2个棋子
	// true 表示没有其他的棋子占据
	private hasChessFilter(posi:IPosition):boolean{
		return !_.find(this.chBoard.chessList,ch=>ch.posi.x ==posi.x && ch.posi.y ==posi.y);
	}

	constructor() {
		this.id = parseInt(_.uniqueId());
		this.status = ChessStatus.beforeChoose;
		this.skillList = [];
	}

	static createChessByType(cht:ChessType):IChess{
		return new chessList[cht]();
	}

}