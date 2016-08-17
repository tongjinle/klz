/// <reference path="../typings/index.d.ts" />

import {IChessBoard, IPosition} from './types';
import _ = require('underscore');






// *************************************************************************
// 基础range函数 START
// *************************************************************************

// 直线
// 0123 -> 上右下左
export function lineRange(posiSource: IPosition, dist: number, dire: number): IPosition[] {
	let posiList: IPosition[] = [];
	let xStep: number;
	let yStep: number;
	if (dire == 0) {
		xStep = 0;
		yStep = 1;
	} else if (dire == 1) {
		xStep = 1;
		yStep = 0;
	} else if (dire == 2) {
		xStep = 0;
		yStep = -1;
	} else if (dire == 3) {
		xStep = -1;
		yStep = 0;
	}
	for (let i = 0; i < dist; i++) {
		posiList.push({ x: posiSource.x + xStep * (i + 1), y: posiSource.y + yStep * (i + 1) });
	}
	return posiList;
};


// 斜线
// 0123 -> 右上,右下,左下,左上
export function slashRange(posiSource: IPosition, dist: number, dire: number): IPosition[] {
	let posiList: IPosition[] = [];
	let xStep: number;
	let yStep: number;
	if (dire == 0) {
		xStep = 1;
		yStep = 1;
	} else if (dire == 1) {
		xStep = 1;
		yStep = -1;
	} else if (dire == 2) {
		xStep = -1;
		yStep = -1;
	} else if (dire == 3) {
		xStep = -1;
		yStep = 1;
	}
	for (let i = 0; i < dist; i++) {
		posiList.push({ x: posiSource.x + xStep * (i + 1), y: posiSource.y + yStep * (i + 1) });
	}
	return posiList;
};


// 周围
// near = line * 4个方向
export function nearRange(posiSource: IPosition, dist: number): IPosition[] {
	let posiList: IPosition[] = [];
	for (var i = 0; i < 4; i++) {
		posiList = posiList.concat(lineRange(posiSource, dist, i));
	}
	return posiList;
};

// 四角度斜线
// nearSlash = slash * 4;
export function nearSlashRange(posiSource: IPosition, dist: number): IPosition[] {
	let range: IPosition[] = [];
	for (let i = 0; i < 4; i++) {
		range = range.concat(slashRange(posiSource, dist, i));
	}
	return range;
}

// 圆圈
export function circleRange(posiSource: IPosition, radius: number): IPosition[] {
	let posiList: IPosition[] = [];
	for (let x = -radius; x <= radius; x++) {
		for (let y = -radius; y <= radius; y++) {
			if (!(x == 0 && y == 0)) {
				posiList.push({ x: x + posiSource.x, y: y + posiSource.y });
			}
		}
	}
	return posiList;
};

// 曼哈顿
export function manhattanRange(posiSource: IPosition, radius: number): IPosition[] {
	let posiList: IPosition[] = [];
	for (let x = -radius; x <= radius; x++) {
		for (let y = -radius; y <= radius; y++) {
			let manhDist: number = Math.abs(x) + Math.abs(y);
			if (manhDist <= radius && manhDist != 0) {
				posiList.push({ x: x + posiSource.x, y: y + posiSource.y });
			}
		}
	}
	return posiList;
};

// 获取两点之间的坐标
export function getBetween(pa: IPosition, pb: IPosition): IPosition[] {
	let range: IPosition[] = [];
	let [minX, maxX] = [pa.x, pb.x].sort((a, b) => a - b);
	let [minY, maxY] = [pa.y, pb.y].sort((a, b) => a - b);
	for (var x = minX; x <= maxX; x++) {
		for (var y = minY; y <= maxY; y++) {
			range.push({ x, y });
		}
	}
	range = sub(range, [pa, pb]);
	return range;
}

// 获取position的唯一主键
function getPosiKey(posi: IPosition) {
	return [posi.x, posi.y].join('-');
}

// 去重
export function unique(posiList: IPosition[]): IPosition[] {
	return _.uniq(posiList, getPosiKey);
}

// 差集
export function sub(posiListSource: IPosition[], posiListTarget: IPosition[]): IPosition[] {
	var posiList: IPosition[] = [];
	var dict = _.indexBy(posiListSource, getPosiKey);
	var dictForSub = _.indexBy(posiListTarget, getPosiKey);
	_.each(dict, (value, key) => {
		if (!dictForSub[key]) {
			posiList.push(_.clone(value));
		}
	});
	return posiList;
}



// *************************************************************************
// 基础range函数 END
// *************************************************************************





