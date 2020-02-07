import assert = require("assert");
import ChessBoard from "../logic/chessBoard/chessBoard";

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
    chBoard.addPlayer("jack", "red");
    let jack = chBoard.playerList.find(p => p.name === "jack");
    assert.ok(jack);
  });

  // 选手准备,会自动开启游戏
  it("ready", () => {
    chBoard.addPlayer("jack", "red");
    chBoard.addPlayer("tom", "black");

    let jack = chBoard.playerList.find(p => p.name == "jack");
    let tom = chBoard.playerList.find(p => p.name == "tom");

    assert(chBoard.status === "beforeStart");
    assert(jack.status === "ready");
    assert(tom.status === "ready");

    assert(chBoard.status === "beforeStart");

    assert(chBoard.status === "red");
  });
});
