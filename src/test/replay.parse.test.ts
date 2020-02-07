import assert = require("assert");
import {
  ActionType,
  SkillType,
  ChessType,
  IRecord,
  ChessBoardStatus,
  ChessColor,
  ChessStatus
} from "../logic/types";
import Replay from "../logic/replay";
import ChessBoard from "../logic/chessBoard/chessBoard";

describe("read replay", () => {
  let recoList = [
    {
      round: 0,
      actionType: "addPlayer",
      data: { red: "jack", black: "tom" }
    },
    { round: 0, actionType: "setMapSeed", data: { seed: 1216 } },
    {
      round: 0,
      actionType: "setMapSize",
      data: { width: 8, height: 8 }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "knight",
        position: { x: 0, y: 0 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "cavalry",
        position: { x: 1, y: 0 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "minister",
        position: { x: 2, y: 0 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "magic",
        position: { x: 3, y: 0 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "king",
        position: { x: 4, y: 0 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "minister",
        position: { x: 5, y: 0 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "cavalry",
        position: { x: 6, y: 0 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "knight",
        position: { x: 7, y: 0 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 0, y: 1 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 1, y: 1 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 2, y: 1 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 3, y: 1 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 4, y: 1 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 5, y: 1 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 6, y: 1 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 7, y: 1 },
        chessColor: "red"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "knight",
        position: { x: 0, y: 7 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "cavalry",
        position: { x: 1, y: 7 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "minister",
        position: { x: 2, y: 7 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "king",
        position: { x: 3, y: 7 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "magic",
        position: { x: 4, y: 7 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "minister",
        position: { x: 5, y: 7 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "cavalry",
        position: { x: 6, y: 7 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "knight",
        position: { x: 7, y: 7 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 0, y: 6 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 1, y: 6 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 2, y: 6 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 3, y: 6 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 4, y: 6 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 5, y: 6 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 6, y: 6 },
        chessColor: "black"
      }
    },
    {
      round: 0,
      actionType: "addChess",
      data: {
        chessType: "footman",
        position: { x: 7, y: 6 },
        chessColor: "black"
      }
    },
    {
      round: 1,
      actionType: "chooseChess",
      data: { position: { x: 0, y: 1 } }
    },
    {
      round: 1,
      actionType: "moveChess",
      data: { position: { x: 0, y: 2 } }
    },
    {
      round: 2,
      actionType: "chooseChess",
      data: { position: { x: 4, y: 7 } }
    },
    {
      round: 2,
      actionType: "moveChess",
      data: { position: { x: 4, y: 3 } }
    },
    {
      round: 2,
      actionType: "chooseSkill",
      data: { skillType: "fire" }
    },
    {
      round: 2,
      actionType: "castSkill",
      data: { position: { x: 4, y: 1 } }
    },
    { round: 3, actionType: "rest" }
  ];

  let rep: Replay;
  let chBoard: ChessBoard;

  before(() => {
    chBoard = new ChessBoard();
    rep = chBoard.replay;
  });

  it("addPlayer", () => {
    rep.parse(recoList[0] as IRecord);

    assert(chBoard.playerList.length === 2);
    assert(chBoard.status === "red");
  });

  it("setMapSeed", () => {
    rep.parse(recoList[1] as IRecord);
    assert(chBoard.seed === 1216);
  });

  it("setMapSize", () => {
    rep.parse(recoList[2] as IRecord);
    assert(chBoard.width === 8);
    assert(chBoard.height === 8);
  });

  it("addChess", () => {
    recoList.slice(3, 3 + 32).forEach(reco => {
      rep.parse(reco as IRecord);
    });
    assert(chBoard.chessList.length === 32);
  });

  it("red choose chess", () => {
    rep.parse(recoList[35] as IRecord);
    assert.deepEqual(chBoard.currentChess.position, { x: 0, y: 1 });
  });

  it("red move chess", () => {
    let ch = chBoard.currentChess;
    rep.parse(recoList[36] as IRecord);
    assert.deepEqual(ch.position, { x: 0, y: 2 });
  });

  it("black choose chess(magic)", () => {
    assert(chBoard.currentPlayer.color === "black");

    // mock tom's energy to choose magic
    chBoard.currentPlayer.energy = 100;

    rep.parse(recoList[37] as IRecord);
    assert(chBoard.currentChess.type === "magic");
  });

  it("black move chess", () => {
    // currentChess一旦move
    let ch = chBoard.currentChess;
    rep.parse(recoList[38] as IRecord);
    assert.deepEqual(ch.position, { x: 4, y: 3 });
  });

  it("black cast skill", () => {
    let ch = chBoard.currentChess;

    rep.parse(recoList[39] as IRecord);
    rep.parse(recoList[40] as IRecord);

    // 因为火球攻击了(4,1)位置的棋子,该棋子死亡
    // 所以这个位置应该没有棋子了
    assert(!chBoard.getChessByPosition({ x: 4, y: 1 }));
    assert(ch.status === "rest");
  });

  it("red rest", () => {
    // 其实是red的主动休息
    // 8(初始)-1(移动)+2(被动休息)+4(主动休息)=13
    rep.parse(recoList[41] as IRecord);
    let red = chBoard.playerList.find(p => p.color == "red");
    let black = chBoard.playerList.find(p => p.color == "black");
    assert(red.energy === 13);
  });
});
