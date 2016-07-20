namespace Api {
	// 创建棋子
	export function createChess(type: ChessType): IChess {
		let ch: IChess;
		return ch;
	}

	// 找到可以行走的范围
	export function getChessMoveRange(ch: IChess, chBoard: IChessBoard): IPosition[] {
		let posiList: IPosition[] = [];
		return posiList;
	}

	// 移动棋子
	export function moveChess(ch: IChess, chBoard: IChessBoard, posiTarget: IPosition): IRecord {
		let re: IRecord;
		return re;
	}

	// 找到技能可以施放的目标点
	export function getChessSkillCastRange(sk: ISkill, chBoard: IChessBoard, posiSource: IPosition): IPosition[] {
		let posiList: IPosition[] = [];
		return posiList;
	}

	// 找到技能在目标点施放,会影响到的目标格子
	export function getChessSkillCastEffectRange(sk: ISkill, chBoard: IChessBoard, posiSource: IPosition, posiTarget: IPosition) {
		let posiList: IPosition[] = [];
		return posiList;
	}


	// 施放棋子技能
	export function castChessSkill(ch: IChess, sk: ISkill, chTarget?: IChess): IRecord {
		let re: IRecord;
		return re;
	}

	// 读取记录
	export function readRecord(mgr: IRecordMgr, filter: IRecordFilter): any {

	}

	// 写入记录
	export function writeRecord(mgr: IRecordMgr, reco: IRecord): void {

	}

	// 位置相关
	export namespace Position {
		// 是否在棋盘中
		export function isInChessBoard(chBoard: IChessBoard, posi: IPosition): boolean {
			let rst: boolean = true;
			rst = rst && (posi.x >= 0 && posi.x < chBoard.width && posi.y >= 0 && posi.y <= chBoard.heigth);
			return rst;
		}
	}
}

