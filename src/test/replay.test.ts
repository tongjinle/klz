import assert = require("assert");
import ChessBoard from "../logic/chessBoard/chessBoard";
import Player from "../logic/player/player";
import Replay from "../logic/replay";
import { ActionType, ChessColor, ChessType, IRecord } from "../logic/types";

describe("replay", () => {
  let rep: Replay;
  let chBoard: ChessBoard;

  beforeEach(() => {
    chBoard = new ChessBoard();
    rep = chBoard.replay;
  });

  it("setMapSeed", () => {
    chBoard.setMapSeed(100);
    let reco = rep.recordList.find(n => n.actionType === ActionType.setMapSeed);
    assert(reco);
  });

  it("setMapSize", () => {
    chBoard.setMapSize(80, 80);
    // let reco = _.find(recoList, reco => reco.action == ActionType.setMapSize);
    let reco = rep.recordList.find(n => n.actionType === ActionType.setMapSize);
    assert(reco.data.width === 80 && reco.data.height === 80);
  });

  it("setMapChess", () => {
    chBoard.setMapSize(8, 8);
    let chList = [
      {
        color: ChessColor.red,
        chessType: ChessType.footman,
        position: { x: 1, y: 1 }
      },
      {
        color: ChessColor.black,
        chessType: ChessType.king,
        position: { x: 1, y: 2 }
      }
    ];
    chBoard.setMapChess(chList);

    let list: IRecord[];
    list = rep.recordList.filter(n => n.actionType === ActionType.addChess);
    assert(list.length === 2);
    assert.deepEqual(list[0].data, {
      chessType: ChessType.footman,
      position: { x: 1, y: 1 },
      chessColor: ChessColor.red
    });
  });
});
