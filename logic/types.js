"use strict";
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
(function (ChessColor) {
    ChessColor[ChessColor["red"] = 0] = "red";
    ChessColor[ChessColor["black"] = 1] = "black";
})(exports.ChessColor || (exports.ChessColor = {}));
var ChessColor = exports.ChessColor;
(function (ChessType) {
    ChessType[ChessType["footman"] = 0] = "footman";
    ChessType[ChessType["cavalry"] = 1] = "cavalry";
    ChessType[ChessType["minister"] = 2] = "minister";
    ChessType[ChessType["magic"] = 3] = "magic";
    ChessType[ChessType["king"] = 4] = "king";
})(exports.ChessType || (exports.ChessType = {}));
var ChessType = exports.ChessType;
// move之后可以cast
// cast之后,就rest
(function (ChessStatus) {
    ChessStatus[ChessStatus["beforeMove"] = 0] = "beforeMove";
    ChessStatus[ChessStatus["beforeCast"] = 1] = "beforeCast";
    ChessStatus[ChessStatus["rest"] = 2] = "rest";
})(exports.ChessStatus || (exports.ChessStatus = {}));
var ChessStatus = exports.ChessStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["waiting"] = 0] = "waiting";
    PlayerStatus[PlayerStatus["thinking"] = 1] = "thinking";
    // done是整局下完
    PlayerStatus[PlayerStatus["done"] = 2] = "done";
})(exports.PlayerStatus || (exports.PlayerStatus = {}));
var PlayerStatus = exports.PlayerStatus;
(function (SkillType) {
    SkillType[SkillType["attack"] = 0] = "attack";
    SkillType[SkillType["heal"] = 1] = "heal";
})(exports.SkillType || (exports.SkillType = {}));
var SkillType = exports.SkillType;
(function (RecordType) {
    RecordType[RecordType["round"] = 0] = "round";
    RecordType[RecordType["move"] = 1] = "move";
    RecordType[RecordType["cast"] = 2] = "cast";
    RecordType[RecordType["rest"] = 3] = "rest";
})(exports.RecordType || (exports.RecordType = {}));
var RecordType = exports.RecordType;
(function (AskType) {
    AskType[AskType["selectChess"] = 0] = "selectChess";
    AskType[AskType["unSelectChess"] = 1] = "unSelectChess";
    AskType[AskType["selectPosition"] = 2] = "selectPosition";
    AskType[AskType["confirmPosition"] = 3] = "confirmPosition";
    AskType[AskType["selectSkill"] = 4] = "selectSkill";
    AskType[AskType["unSelectSkill"] = 5] = "unSelectSkill";
    AskType[AskType["rest"] = 6] = "rest";
    AskType[AskType["giveup"] = 7] = "giveup";
})(exports.AskType || (exports.AskType = {}));
var AskType = exports.AskType;
