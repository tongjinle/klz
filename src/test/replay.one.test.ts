import assert = require("assert");
import ChessBoard from "../logic/chessBoard/chessBoard";
import Player from "../logic/player/player";
import Replay from "../logic/replay";
import {
  ActionType,
  ChessColor,
  PlayerStatus,
  SkillType
} from "../logic/types";
import { ChooseSkillRecord, CastSkillRecord } from "../logic/recordTypes";

// 每个it之间有前后关系
describe("write replay", () => {
  let rep: Replay;
  let chBoard: ChessBoard;
  let jack: Player;
  let tom: Player;

  before(() => {
    chBoard = new ChessBoard();
    rep = chBoard.replay;

    chBoard.addPlayer("jack", "red");
    chBoard.addPlayer("tom", "black");

    jack = chBoard.getPlayerByName("jack");
    tom = chBoard.getPlayerByName("tom");

    chBoard.start();
  });

  after(() => {
    // console.log(JSON.stringify(rep.recordList, undefined, 4));
  });

  it("add player", () => {
    assert(
      rep.recordList.filter(n => n.actionType === "addPlayer").length === 1
    );
  });

  it("addChess", () => {
    chBoard.readMap("normal");

    let reco = rep.recordList.find(
      n =>
        n.actionType === "addChess" &&
        n.data.chessColor === "red" &&
        n.data.position.x == 0 &&
        n.data.position.y == 1
    );
    assert(reco);
  });

  it("choose chess", () => {
    let ch = chBoard.getChessByPosition({ x: 0, y: 1 });
    chBoard.chooseChess(ch);
    let reco = rep.recordList.find(n => n.actionType === "chooseChess");
    assert(!reco);
  });

  // 移动了棋子,会产生选择棋子和
  it("move chess", () => {
    chBoard.moveChess({ x: 0, y: 2 });
    let chooseChessReco = rep.recordList.find(
      n => n.actionType === "chooseChess"
    );
    assert(chooseChessReco);

    let moveChessReco = rep.recordList.find(n => n.actionType === "moveChess");
    assert(
      moveChessReco &&
        moveChessReco.data.position.x === 0 &&
        moveChessReco.data.position.y === 2
    );
  });

  // 这个时候round转到了tom
  // tom选择(4,7)的magic移动到(4,3),使用fire技能,攻击jack在(4,1)的footman,造成footman死亡
  // 临时把tom的energy的energy提高,为了行动"magic"棋子
  it("chooseSkill", () => {
    tom.energy = 10;

    let ch = chBoard.getChessByPosition({ x: 4, y: 7 });
    chBoard.chooseChess(ch);
    chBoard.moveChess({ x: 4, y: 3 });
    chBoard.chooseSkill("fire");
    let reco = rep.recordList.find(n => n.actionType === "chooseSkill");
    assert(!reco);
  });

  // 使用技能
  it("castSkill", () => {
    chBoard.castSkill({ x: 4, y: 1 });
    {
      let reco = rep.recordList.find(n => n.actionType === "chooseSkill");
      assert(reco);
      let data: ChooseSkillRecord = reco.data;
      assert(data.skillType === "fire");
    }
    {
      let reco = rep.recordList.find(n => n.actionType === "castSkill");
      assert(reco);
      let data: CastSkillRecord = reco.data;
      assert.deepEqual(data.position, { x: 4, y: 1 });
    }
  });

  // jack's round
  // jack 主动休息
  it("rest", () => {
    chBoard.rest();
    let reco = rep.recordList.find(n => n.actionType === "rest");
    assert(reco);
  });
});
