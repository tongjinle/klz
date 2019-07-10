import assert = require("assert");
import ChessBoard from "../logic/chessBoard/chessBoard";
import { ChessColor, ChessBoardStatus, PlayerStatus } from "../logic/types";

describe("chessBoard", () => {
  let chBoard: ChessBoard;

  beforeEach(() => {
    chBoard = new ChessBoard();
    chBoard.readMap("normal");
  });

  // 初始化普通地图
  // 一共32个棋子
  it("init normal", () => {
    assert(chBoard.chessList.length === 32);
  });

  // 增加/删除选手
  // 1 新增一个选手jack
  it("add/remove player", () => {
    chBoard.addPlayer("jack", ChessColor.red);
    let jack = chBoard.playerList.find(p => p.name === "jack");
    assert.ok(jack);

    assert(chBoard.canAddPlayer("tom", ChessColor.black) === true);

    assert(chBoard.canAddPlayer("jack", ChessColor.black) === false);
    assert(chBoard.canAddPlayer("tom", ChessColor.red) === false);

    chBoard.addPlayer("tom", ChessColor.black);
    assert(chBoard.canAddPlayer("lily", ChessColor.black) === false);
  });

  // 选手准备,会自动开启游戏
  it("ready", () => {
    chBoard.addPlayer("jack", ChessColor.red);
    chBoard.addPlayer("tom", ChessColor.black);

    let jack = chBoard.playerList.find(p => p.name == "jack");
    let tom = chBoard.playerList.find(p => p.name == "tom");

    assert(chBoard.status === ChessBoardStatus.beforeStart);
    assert(jack.status === PlayerStatus.notReady);
    assert(tom.status === PlayerStatus.notReady);

    chBoard.ready("jack", PlayerStatus.ready);
    chBoard.ready("jack", PlayerStatus.notReady);
    chBoard.ready("tom", PlayerStatus.ready);
    assert(chBoard.status === ChessBoardStatus.beforeStart);

    chBoard.ready("jack", PlayerStatus.ready);
    assert(chBoard.status === ChessBoardStatus.red);
  });
});
