import assert = require("assert");
import ChessBoard from "../chessBoard/chessBoard";
import Player from "../player/player";
import {
  ChessColor,
  PlayerStatus,
  ChessStatus,
  ChessBoardJudge
} from "../types";
import Chess from "../chess/chess";
import EmptyChess from "../chess/emptyChess";
import EmptySkill from "../skill/emptySkill";
import * as api from "../api";

const chessSort = (cha, chb) => chb.id - cha.id;

describe("chessBoard basis", () => {
  let chBoard: ChessBoard;
  let jack: Player;
  let tom: Player;

  beforeEach(() => {
    chBoard = new ChessBoard();
    chBoard.setMapSize(8, 8);

    chBoard.addPlayer("jack", ChessColor.red);
    chBoard.addPlayer("tom", ChessColor.black);

    // 选手准备
    chBoard.ready("jack", PlayerStatus.ready);
    chBoard.ready("tom", PlayerStatus.ready);

    jack = chBoard.playerList.find(p => p.name == "jack");
    tom = chBoard.playerList.find(p => p.name == "tom");
  });

  // round可以强行设定当前行棋的选手
  it("currPlayer", () => {
    chBoard.round("tom");
    assert(chBoard.currPlayer.name === "tom");
  });

  //  获取当前选手的状态
  it("currPlayerStatus", () => {
    chBoard.round("jack");
    assert(jack.status === PlayerStatus.thinking);
    assert(jack.chessStatus === ChessStatus.beforeChoose);
  });

  // // 获取可以被选择的的棋子
  // it("chessCanBeChoose", () => {
  //   let list = [
  //     { id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
  //     { id: 1, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red },
  //     { id: 2, energy: 1, posi: { x: 1, y: 3 }, color: ChessColor.black },
  //     { id: 3, energy: 5, posi: { x: 1, y: 4 }, color: ChessColor.red }
  //   ];

  //   list.forEach( n => {
  //     let ch: Chess = new Chess();
  //     ch.id = n.id.toString();
  //     ch.energy = n.energy;
  //     ch.position = n.posi;
  //     ch.color = n.color;
  //     ch.getMoveRange = () => [{ x: -1, y: -1 }];
  //     chBoard.addChess(ch);
  //   });

  //   repMgr.parse({
  //     action: "addChess",
  //     data: {
  //       chessType: ChessType.footman,
  //       position: { x: 11, y: 1 },
  //       chessColor: ChessColor.red
  //     }
  //   });
  //   repMgr.parse({
  //     action: "addChess",
  //     data: {
  //       chessType: ChessType.footman,
  //       position: { x: 1, y: 1 },
  //       chessColor: ChessColor.red
  //     }
  //   });
  //   repMgr.parse({
  //     action: "addChess",
  //     data: {
  //       chessType: ChessType.footman,
  //       position: { x: 1, y: 1 },
  //       chessColor: ChessColor.red
  //     }
  //   });
  //   repMgr.parse({
  //     action: "addChess",
  //     data: {
  //       chessType: ChessType.footman,
  //       position: { x: 1, y: 1 },
  //       chessColor: ChessColor.red
  //     }
  //   });

  //   jack.energy = 3;
  //   let activeChList = chBoard.getActiveChessList();
  //   expect(_.map(activeChList, ch => ch.id)).toEqual([0, 1]);
  // });

  // 选手选择棋子
  // 1. energy的限制
  // 2. 颜色的限制
  it("chooseChess", () => {
    let list = [
      { id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
      { id: 1, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red },
      { id: 2, energy: 1, posi: { x: 1, y: 3 }, color: ChessColor.black },
      { id: 3, energy: 5, posi: { x: 1, y: 4 }, color: ChessColor.red }
    ];

    list.forEach(n => {
      let ch: Chess = new EmptyChess();
      ch.id = n.id.toString();
      ch.energy = n.energy;
      ch.position = n.posi;
      ch.color = n.color;
      // 修改wood的行走
      ch.getMoveRange = () => [{ x: 0, y: 0 }];
      chBoard.addChess(ch);
    });

    jack.energy = 3;

    // jack只能操作0和1
    {
      let rst = chBoard.getActiveChessList().sort(chessSort);
      let exp = chBoard.chessList
        .filter(ch => ["0", "1"].indexOf(ch.id) >= 0)
        .sort(chessSort);
      assert.deepEqual(rst, exp);
    }

    let ch: Chess = chBoard.chessList.find(ch => ch.id === "0");
    chBoard.chooseChess(ch);
    assert(jack.chessStatus === ChessStatus.beforeMove);
    assert(ch.status === ChessStatus.beforeMove);
    assert(chBoard.currChess === ch);

    // 他人的棋子不能选择
    let otherCh = chBoard.chessList.find(ch => ch.id === "3");
    {
      let rst = chBoard.canChooseChess(otherCh);
      let exp = false;
      assert(rst === exp);
    }
  });

  // 选手反选当前棋子
  it("unChooseChess", () => {
    let list = [
      { id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red }
    ];
    list.forEach(n => {
      let ch: Chess = new EmptyChess();
      ch.id = n.id.toString();
      ch.energy = n.energy;
      ch.position = n.posi;
      ch.getMoveRange = () => [{ x: 0, y: 0 }];
      ch.color = n.color;
      chBoard.addChess(ch);
    });

    jack.energy = 3;
    let ch: Chess = chBoard.chessList.find(ch => ch.id == "0");
    chBoard.chooseChess(ch);
    chBoard.unChooseChess();
    assert(jack.chessStatus === ChessStatus.beforeChoose);
    assert(ch.status === ChessStatus.beforeChoose);
    assert(!chBoard.currChess);
  });

  // 选手移动棋子
  it("moveChess", () => {
    let list = [
      { id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
      { id: 1, energy: 1, posi: { x: 1, y: 4 }, color: ChessColor.black }
    ];
    list.forEach(n => {
      let ch: Chess = new EmptyChess();
      ch.id = n.id.toString();
      ch.energy = n.energy;
      ch.position = n.posi;
      ch.color = n.color;
      ch.getMoveRange = () => [{ x: 1, y: 2 }, { x: 1, y: 3 }];
      chBoard.addChess(ch);
    });

    let chBlack: Chess = chBoard.chessList.find(ch => ch.id === "1");
    let sk = new EmptySkill();
    sk.getCastRange = () => {
      let chBoard = sk.owner.chessBoard;
      let range = api.rangeApi.nearRange(sk.owner.position, 1).filter(posi => {
        let ch = chBoard.getChessByPosition(posi);
        return ch && ch.color != sk.owner.color;
      });
      return range;
    };
    chBlack.addSkill(sk);

    let ch: Chess;
    // jack移动了棋子,然后没有攻击目标,自动进入休息
    assert(chBoard.currPlayer === jack);
    jack.energy = 3;
    ch = chBoard.chessList.find(ch => ch.id === "0");
    chBoard.chooseChess(ch);
    chBoard.moveChess({ x: 1, y: 2 });

    assert.deepEqual(ch.position, { x: 1, y: 2 });
    assert(jack.status === PlayerStatus.waiting);
    assert(jack.chessStatus === ChessStatus.rest);
    assert(ch.status === ChessStatus.rest);
    assert(!chBoard.currChess);

    // tom移动了棋子,然后有攻击目标
    assert(chBoard.currPlayer === tom);
    tom.energy = 10;
    ch = chBoard.chessList.find(ch => ch.id === "1");
    chBoard.chooseChess(ch);
    chBoard.moveChess({ x: 1, y: 3 });
    assert(tom.status === PlayerStatus.thinking);
    assert(tom.chessStatus === ChessStatus.beforeCast);
    assert(ch.status === ChessStatus.beforeCast);
    assert(chBoard.currChess);
  });

  // 选手选择技能
  it("chooseSkill", () => {
    // 在有技能可以被选择的情况下,选择之后currSkill能正确显示
    let list = [
      { id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
      { id: 1, energy: 1, posi: { x: 1, y: 4 }, color: ChessColor.black }
    ];
    list.forEach(n => {
      let ch: Chess = new EmptyChess();
      ch.id = n.id.toString();
      ch.energy = n.energy;
      ch.position = n.posi;
      ch.color = n.color;
      chBoard.addChess(ch);
    });

    let ch: Chess = chBoard.chessList.find(ch => ch.id === "0");
    let skList = [
      { type: 0, getCastRange: () => [{ x: 5, y: 5 }] },
      { type: 1, getCastRange: () => [] }
    ];
    skList.forEach(n => {
      let sk = new EmptySkill();
      sk.type = n.type;
      sk.getCastRange = n.getCastRange;
      ch.addSkill(sk);
    });

    chBoard.chooseChess(ch);
    assert(ch.canCastSkillList.length === 1);
    assert(ch.canCastSkillList[0].type === 0);

    chBoard.chooseSkill(0);
    assert(chBoard.currSkill === ch.skillList[0]);
  });

  // 选手反选技能
  it("unchooseSkill", () => {
    let list = [
      { id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
      { id: 1, energy: 1, posi: { x: 1, y: 4 }, color: ChessColor.black },
      { id: 2, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red }
    ];
    list.forEach(n => {
      let ch: Chess = new EmptyChess();
      ch.id = n.id.toString();
      ch.energy = n.energy;
      ch.position = n.posi;
      ch.color = n.color;
      chBoard.addChess(ch);
    });

    let ch: Chess;
    let skList = [
      { chId: 0, type: 0, getCastRange: () => [{ x: 5, y: 5 }] },
      { chId: 2, type: 0, getCastRange: () => [{ x: 5, y: 5 }] },
      { chId: 0, type: 1, getCastRange: () => [] }
    ];
    skList.forEach(n => {
      let sk = new EmptySkill();
      sk.type = n.type;
      sk.getCastRange = n.getCastRange;
      let ch = chBoard.chessList.find(ch => ch.id === n.chId.toString());
      ch.addSkill(sk);
    });

    ch = chBoard.chessList.find(ch => ch.id === "0");

    // 在选择了技能的情况下,可以反选
    // 反选之后,当前技能为空
    chBoard.chooseChess(ch);
    chBoard.chooseSkill(0);
    assert(chBoard.currSkill === ch.skillList[0]);
    chBoard.unChooseSkill();
    assert(!chBoard.currSkill);
  });

  it("unchooseChess-auto unchooseSkill", () => {
    let list = [
      { id: 0, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
      { id: 1, energy: 1, posi: { x: 1, y: 4 }, color: ChessColor.black },
      { id: 2, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red }
    ];
    list.forEach(n => {
      let ch: Chess = new EmptyChess();
      ch.id = n.id.toString();
      ch.energy = n.energy;
      ch.position = n.posi;
      ch.color = n.color;
      chBoard.addChess(ch);
    });

    let ch: Chess;
    let skList = [
      { chId: 0, type: 0, getCastRange: () => [{ x: 5, y: 5 }] },
      { chId: 2, type: 1, getCastRange: () => [{ x: 5, y: 5 }] },
      { chId: 0, type: 2, getCastRange: () => [] }
    ];
    skList.forEach(n => {
      let sk = new EmptySkill();
      sk.type = n.type;
      sk.getCastRange = n.getCastRange;
      let ch = chBoard.chessList.find(ch => ch.id == n.chId.toString());
      ch.skillList.push(sk);
      sk.owner = ch;
    });

    // 改选了棋子之后,会自动反选技能
    let ch0 = chBoard.chessList.find(ch => ch.id === "0");
    let ch2 = chBoard.chessList.find(ch => ch.id === "2");
    let sk0 = ch0.skillList.find(sk => sk.type === 0);
    chBoard.chooseChess(ch0);
    chBoard.chooseSkill(0);
    assert(chBoard.currSkill === sk0);
    // 改选棋子
    chBoard.unChooseChess();
    assert(!chBoard.currSkill);
  });

  // 选手攻击棋子
  it("castSkill", () => {
    // jack使用棋子0的技能0攻击tom的棋子1,造成100伤害
    let list = [
      { id: 0, hp: 10, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
      {
        id: 1,
        hp: 10,
        energy: 1,
        posi: { x: 1, y: 4 },
        color: ChessColor.black
      },
      { id: 2, hp: 10, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red }
    ];
    list.forEach(n => {
      let ch: Chess = new EmptyChess();
      ch.id = n.id.toString();
      ch.hp = 10;
      ch.energy = n.energy;
      ch.position = n.posi;
      ch.color = n.color;
      chBoard.addChess(ch);
    });
    let chOfJack = chBoard.chessList.find(ch => ch.id === "0");
    let chOfTom = chBoard.chessList.find(ch => ch.id == "2");

    let ch: Chess;
    let skList = [
      {
        chId: 0,
        type: 0,
        getCastRange: () => [{ x: 1, y: 4 }],
        cast: posi => {
          // console.log('use skill cast');
          chOfTom.hp = 9;
        }
      },
      {
        chId: 2,
        type: 1,
        getCastRange: () => [{ x: 5, y: 5 }],
        cast: undefined
      },
      { chId: 0, type: 2, getCastRange: () => [], cast: undefined }
    ];
    skList.forEach(n => {
      let sk = new EmptySkill();
      sk.type = n.type;
      sk.getCastRange = n.getCastRange;
      sk.cast = n.cast;
      let ch = chBoard.chessList.find(ch => ch.id == n.chId.toString());
      ch.addSkill(sk);
    });

    chBoard.chooseChess(chOfJack);
    chBoard.chooseSkill(0);
    chBoard.castSkill({ x: 1, y: 4 });
    assert(chOfTom.hp === 9);
    assert(chOfJack.status === ChessStatus.rest);
    assert(jack.status === PlayerStatus.waiting);
    assert(jack.chessStatus === ChessStatus.rest);
  });

  // 主动休息和被动休息
  it("rest", () => {
    let list = [
      { id: 0, hp: 10, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
      {
        id: 1,
        hp: 10,
        energy: 1,
        posi: { x: 1, y: 4 },
        color: ChessColor.black
      },
      { id: 2, hp: 10, energy: 1, posi: { x: 1, y: 2 }, color: ChessColor.red }
    ];
    list.forEach(n => {
      let ch: Chess = new EmptyChess();
      ch.id = n.id.toString();
      ch.hp = 10;
      ch.energy = n.energy;
      ch.position = n.posi;
      ch.color = n.color;
      ch.getMoveRange = () => [{ x: -1, y: -1 }];
      chBoard.addChess(ch);
    });

    jack.energy = 0;
    tom.energy = 5;
    // 主动休息加4点能量
    chBoard.rest();
    assert(jack.energy === 4);
    // 被动休息加2点能量
    let ch = chBoard.chessList.find(ch => ch.id === "1");
    chBoard.chooseChess(ch);
    chBoard.moveChess({ x: 1, y: 3 });
    chBoard.rest();
    // 5-1+2
    assert(tom.energy === 6);
  });

  // 判断胜负
  it("judge", () => {
    // 没有棋子了的一方 就获胜
    let list = [
      { id: 0, hp: 10, energy: 1, posi: { x: 1, y: 1 }, color: ChessColor.red },
      {
        id: 1,
        hp: 10,
        energy: 1,
        posi: { x: 1, y: 4 },
        color: ChessColor.black
      }
    ];
    list.forEach(n => {
      let ch: Chess = new EmptyChess();
      ch.id = n.id.toString();
      ch.hp = 10;
      ch.energy = n.energy;
      ch.position = n.posi;
      ch.color = n.color;
      chBoard.addChess(ch);
    });

    let judge: ChessBoardJudge;
    judge = chBoard.judge();
    assert(judge === ChessBoardJudge.none);

    let ch: Chess = chBoard.chessList.find(ch => ch.id === "0");
    chBoard.removeChess(ch);
    judge = chBoard.judge();
    assert(judge === ChessBoardJudge.black);
  });
});
