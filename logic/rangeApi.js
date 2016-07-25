/// <reference path="../typings/index.d.ts" />
"use strict";
// 位置相关
// 是否在棋盘中
function isInChessBoard(chBoard, posi) {
    var rst = true;
    rst = rst && (posi.x >= 0 && posi.x < chBoard.width && posi.y >= 0 && posi.y <= chBoard.heigth);
    return rst;
}
exports.isInChessBoard = isInChessBoard;
// 单个元组parse函数
var parseSingle = function (opts) {
    var posiList;
    return posiList;
};
// *************************************************************************
// 基础range函数 START
// *************************************************************************
// 直线
// 0123 -> 上右下左
function lineRange(posiSource, dist, dire) {
    var posiList = [];
    var xStep;
    var yStep;
    if (dire == 0) {
        xStep = 0;
        yStep = 1;
    }
    else if (dire == 1) {
        xStep = 1;
        yStep = 0;
    }
    else if (dire == 2) {
        xStep = 0;
        yStep = -1;
    }
    else if (dire == 3) {
        xStep = -1;
        yStep = 0;
    }
    for (var i = 0; i < dist; i++) {
        posiList.push({ x: posiSource.x + xStep * (i + 1), y: posiSource.y + yStep * (i + 1) });
    }
    return posiList;
}
exports.lineRange = lineRange;
;
// 斜线
// 0123 -> 右上,右下,左下,左上
function slashRange(posiSource, dist, dire) {
    var posiList = [];
    var xStep;
    var yStep;
    if (dire == 0) {
        xStep = 1;
        yStep = 1;
    }
    else if (dire == 1) {
        xStep = 1;
        yStep = -1;
    }
    else if (dire == 2) {
        xStep = -1;
        yStep = -1;
    }
    else if (dire == 3) {
        xStep = -1;
        yStep = 1;
    }
    for (var i = 0; i < dist; i++) {
        posiList.push({ x: posiSource.x + xStep * (i + 1), y: posiSource.y + yStep * (i + 1) });
    }
    return posiList;
}
exports.slashRange = slashRange;
;
// 周围
// near = line * 4个方向
function nearRange(posiSource, dist) {
    var posiList = [];
    for (var i = 0; i < 4; i++) {
        posiList = posiList.concat(lineRange(posiSource, dist, i));
    }
    return posiList;
}
exports.nearRange = nearRange;
;
// 圆圈
function circleRange(posiSource, radius) {
    var posiList = [];
    for (var x = -radius; x <= radius; x++) {
        for (var y = -radius; y <= radius; y++) {
            if (!(x == 0 && y == 0)) {
                posiList.push({ x: x + posiSource.x, y: y + posiSource.y });
            }
        }
    }
    return posiList;
}
exports.circleRange = circleRange;
;
// 曼哈顿
function manhattanRange(posiSource, radius) {
    var posiList = [];
    for (var x = -radius; x <= radius; x++) {
        for (var y = -radius; y <= radius; y++) {
            var manhDist = Math.abs(x) + Math.abs(y);
            if (manhDist <= radius && manhDist != 0) {
                posiList.push({ x: x + posiSource.x, y: y + posiSource.y });
            }
        }
    }
    return posiList;
}
exports.manhattanRange = manhattanRange;
;
// 获取position的唯一主键
function getPosiKey(posi) {
    return [posi.x, posi.y].join('-');
}
// 去重
function unique(posiList) {
    return _.uniq(posiList, getPosiKey);
}
// 差集
function sub(posiListSource, posiListTarget) {
    var posiList = [];
    var dict = _.indexBy(posiListSource, getPosiKey);
    var dictForSub = _.indexBy(posiListTarget, getPosiKey);
    _.each(dict, function (value, key) {
        if (!dictForSub[key]) {
            posiList.push(_.clone(value));
        }
    });
}
// *************************************************************************
// 基础range函数 END
// *************************************************************************
