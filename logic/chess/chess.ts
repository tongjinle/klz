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
	chBoard: IChessBoard;
	getMoveRange: () => IPosition[];
	getCastRange: (skt: SkillType) => IPosition[];
	round: () => void;
	move: (posiTarget: IPosition) => void;
	cast: (skType: SkillType, posiTarget: IPosition) => void;
	rest: () => void;
	dead: () => void;
	energy: number;
	

	public get canCastSkillList() : ISkill[] {
		if([ChessStatus.beforeMove,ChessStatus.beforeCast].indexOf(this.status)>=0){
			let chEnemies = _.filter(this.chBoard.chessList,ch=>ch.color!=this.color);
			return _.filter(this.skillList,sk=>{
				let range = sk.getCastRange();
				let flag = false;
				flag = !!_.find(range,po=>{
					return _.any(chEnemies,ch=>{
						return ch.posi.x == po.x && ch.posi.y == po.y;
					});
				});
				return flag;
			});
		}
		return [];
	}


	protected getMoveRangeOnPurpose: () => IPosition[];

	private inChessBoardFilter: (posi: IPosition) => boolean = posi => api.chessBoardApi.isInChessBoard(this.chBoard, posi);

	constructor() {
		this.id = parseInt(_.uniqueId());
		this.status = ChessStatus.beforeChoose;
		this.skillList = [];

		this.round = () => {
			api.chessApi.setStatus(this, ChessStatus.beforeMove);
		};

		// 移动
		this.move = (posiTarget) => {
			api.chessApi.move(this, this.chBoard, posiTarget);

			// 如果有技能可以cast,状态为beforeCast
			if(this.canCastSkillList.length){
				this.status = ChessStatus.beforeCast;
			}else{
				// 否则直接进入休息
				this.rest();
			}

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
			api.skillApi.cast(sk, sk.owner.chBoard, posi);
		};

		this.rest = () => {
			this.status = ChessStatus.rest;
		};

		this.dead = () => {

		}
	}
}