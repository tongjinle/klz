/// <reference path="../typings/index.d.ts" />

// 位置相关
// 是否在棋盘中
export function isInChessBoard(chBoard: IChessBoard, posi: IPosition): boolean {
	let rst: boolean = true;
	rst = rst && (posi.x >= 0 && posi.x < chBoard.width && posi.y >= 0 && posi.y <= chBoard.heigth);
	return rst;
}


// 单个元组parse函数
let parseSingle = (opts: [string, number]): IPosition[] => {
	let posiList: IPosition[];

	return posiList;
};

// 参数结构
// 第一层用于合并:[a,b,c]把a,b,c的得到的IPosition[]进行合并
// 第二层用于过滤:[[a1,a2,a3]]
export function parse(rangeDefine: [string, number]): IRangeGen {
	let rst: IRangeGen;
	// 单个元组parse函数
	let parseSingle = (opts: [string, number]): IPosition[] => {
		let posiList: IPosition[];

		return posiList;
	};
	rst = (posi) => {
		let posiList: IPosition[];

		for (let item of rangeDefine) {

		}


		return posiList;
	};

	return rst;
}
