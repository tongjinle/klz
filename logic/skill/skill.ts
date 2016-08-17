import {ChessRelationship, IPosition, IBox, IChessBoard, IChess, ISkill, IEffect, IMoveRecord, IEffectRecord, IRecord, IRecordFilter, IRecordMgr, IRangeGen, IAsk, IAnswer, IPlayer, IGame, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType, RecordType, AskType } from '../types';
import * as api from '../api';
import _ = require('underscore');

export default class Skill implements ISkill {
	id: number;
	type: SkillType;
	owner: IChess;
	getCastRange(): IPosition[] {
		return _(this.getCastRangeOnPurpose())
			.filter(posi => this.inChessBoardFilter(posi));
	};
	maxcd: number;
	cd: number;
	cooldown: () => void;
	cast(posiTarget: IPosition): void {
		this.effect(posiTarget);
	}
	protected getCastRangeOnPurpose(): IPosition[] {
		return undefined;
	};
	protected effect(posiTarget: IPosition) { }


	// 棋盘边界过滤器
	// true 表示在棋盘中
	private inChessBoardFilter(posi: IPosition): boolean {
		return api.chessBoardApi.isInChessBoard(this.owner.chBoard, posi);
	}


	// 遮挡过滤器
	// 查询pa是否有pb的视野
	// 如果在pa跟pb之间,有其他的chess,那么pa就没有视野
	// true 表示视野没有被遮挡
	protected inChessShadowFilter(pa: IPosition, pb: IPosition): boolean {
		let range = api.rangeApi.getBetween(pa, pb);
		return !_.find(range, po => {
			return !!this.owner.chBoard.getChessByPosi(po);
		});
	}

	// 棋子敌我过滤器
	// relationship表示敌我选择
	// true 表示可以被选择
	protected chessFilter(posi: IPosition, rela?: ChessRelationship): boolean {
		let ch = this.owner.chBoard.getChessByPosi(posi);
		if (ch) {
			if (rela == ChessRelationship.enemy) {
				return ch.color != this.owner.color;
			} else if (rela == ChessRelationship.firend) {
				return ch.color == this.owner.color;
			} else {
				return true;
			}
		}
		return false;
	}


	constructor() {
	}
}