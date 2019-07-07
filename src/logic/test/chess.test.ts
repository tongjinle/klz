import assert = require("assert");
import Chess from "../chess/chess";
import ChessBoard from "../chessBoard/chessBoard";
import Skill from "../skill/skill";
import { ChessColor, ChessType, SkillType } from "../types";
import Footman from "../chess/footman";
import Knight from "../chess/knight";
import Wood from "../chess/wood";
import Cavalry from "../chess/cavalry";
import Minister from "../chess/minister";
import Magic from "../chess/magic";
import King from "../chess/king";

const sort = (pa, pb) => 1e5 * pb.x + pb.y - (1e5 * pa.x + pa.y);

describe("chess list", () => {
  let chBoard: ChessBoard;

  beforeEach(() => {
    chBoard = new ChessBoard();
    chBoard.setMapSize(8, 8);
  });

  it("footman", () => {
    let me: Chess = new Footman();
    let enemy: Chess = new Footman();

    me.position = { x: 1, y: 1 };
    me.color = ChessColor.red;
    enemy.position = { x: 1, y: 3 };
    enemy.color = ChessColor.black;

    chBoard.addChess(me);
    chBoard.addChess(enemy);

    let sk: Skill = me.skillList[0];

    // 超过attack的距离
    assert(sk.getCastRange().length === 0);

    // me靠近me2
    {
      me.position.y = 2;
      let exp = [{ x: 1, y: 3 }];

      let rst = sk.getCastRange();
      assert.deepEqual(rst.sort(sort), exp.sort(sort));
    }

    // me攻击targetCh
    // footman生命为4
    // 扣去targetCh 1点hp
    // 剩余3点生命
    {
      sk.cast(enemy.position);
      let rst = enemy.hp;
      let exp = 3;
      assert(rst === exp);
    }
  });

  it("knight", () => {
    let me: Chess = new Knight();
    me.position = { x: 4, y: 4 };
    let sk = me.skillList[0];
    me.color = ChessColor.red;
    chBoard.addChess(me);

    let ch1: Chess = new Wood();
    ch1.position = { x: 1, y: 5 };
    let ch2: Chess = new Wood();
    ch2.position = { x: 1, y: 3 };
    ch1.hp = ch2.hp = 100;
    ch1.color = ch2.color = ChessColor.black;
    chBoard.addChess(ch1);
    chBoard.addChess(ch2);
    // 周围没有敌人
    assert(sk.getCastRange().length === 0);

    // 周围有2个敌人,cast position为自己
    ch1.position.x = ch2.position.x = 4;
    assert.deepEqual(sk.getCastRange().sort(sort), [me.position]);

    // 成功攻击到周围2个敌人
    // 备注:伤害是3
    sk.cast(me.position);
    assert(ch1.hp === 97);
    assert(ch2.hp === 97);
  });

  it("cavalry", () => {
    // 行走范围(特殊)
    let me = new Cavalry();
    me.position = { x: 1, y: 3 };
    me.color = ChessColor.red;
    chBoard.addChess(me);

    let ch1 = new Wood();
    ch1.position = { x: 2, y: 5 };
    ch1.color = ChessColor.black;
    chBoard.addChess(ch1);

    let range = me.getMoveRange();
    let exp = [
      { x: 0, y: 1 },
      { x: 2, y: 1 },
      { x: 0, y: 5 },
      { x: 3, y: 2 },
      { x: 3, y: 4 }
    ];
    assert.deepEqual(range.sort(sort), exp.sort(sort));
  });

  it("minister - heal - valid heal target", () => {
    let me = new Minister();
    me.color = ChessColor.red;
    me.position = { x: 2, y: 4 };
    chBoard.addChess(me);

    // 不满血友军,合法治疗目标
    let f1 = new Wood();
    f1.color = ChessColor.red;
    f1.position = { x: 3, y: 4 };
    f1.hp = 2;
    f1.maxhp = 100;
    chBoard.addChess(f1);

    // 满血友军
    let f2 = new Wood();
    f2.color = ChessColor.red;
    f2.position = { x: 4, y: 4 };
    f2.hp = 100;
    f2.maxhp = 100;
    chBoard.addChess(f2);

    // 超出距离的不满血友军
    let f3 = new Wood();
    f3.color = ChessColor.red;
    f3.position = { x: 3, y: 3 };
    f3.hp = 2;
    f3.maxhp = 100;
    chBoard.addChess(f3);

    // 不满血的敌军
    let e1 = new Wood();
    e1.color = ChessColor.black;
    e1.position = { x: 1, y: 4 };
    e1.hp = 2;
    e1.maxhp = 100;
    chBoard.addChess(e1);

    // 敌人不是我治疗的目标
    // 满血友军不是我治疗目标
    // 超越治疗距离不是我治疗目标(治疗距离为直线4格)
    let heal = me.skillList.find(sk => sk.type == SkillType.heal);
    let exp = [{ x: 3, y: 4 }];
    assert.deepEqual(heal.getCastRange().sort(sort), exp.sort(sort));
  });

  it("minister - heal - no out", () => {
    // 治疗(不考虑视野遮挡)
    let me = new Minister();
    me.color = ChessColor.red;
    me.position = { x: 2, y: 4 };
    chBoard.addChess(me);

    // 不满血友军,合法治疗目标
    let f1 = new Wood();
    f1.color = ChessColor.red;
    f1.position = { x: 3, y: 4 };
    f1.hp = 2;
    f1.maxhp = 100;
    chBoard.addChess(f1);

    // 不满血友军,合法治疗目标
    let f2 = new Wood();
    f2.color = ChessColor.red;
    f2.position = { x: 4, y: 4 };
    f2.hp = 90;
    f2.maxhp = 100;
    chBoard.addChess(f2);

    let toStr = range => range.map(po => [po.x, po.y].join("-")).sort();

    let heal = me.skillList.find(sk => sk.type == SkillType.heal);
    let exp = [{ x: 3, y: 4 }, { x: 4, y: 4 }];
    assert.deepEqual(heal.getCastRange().sort(sort), exp.sort(sort));
  });

  it("minister - heal - effect", () => {
    // 治疗 && 过量治疗
    // 一次治疗量是6点血量
    let me = new Minister();
    me.color = ChessColor.red;
    me.position = { x: 2, y: 4 };
    chBoard.addChess(me);

    // 不满血友军,合法治疗目标
    let f1 = new Wood();
    f1.color = ChessColor.red;
    f1.position = { x: 3, y: 4 };
    f1.hp = 2;
    f1.maxhp = 100;
    chBoard.addChess(f1);

    // 满血友军
    let f2 = new Wood();
    f2.color = ChessColor.red;
    f2.position = { x: 4, y: 4 };
    f2.hp = 99;
    f2.maxhp = 100;
    chBoard.addChess(f2);

    let heal = me.skillList.find(sk => sk.type == SkillType.heal);
    heal.cast({ x: 3, y: 4 });
    assert(f1.hp === 8);

    // 过量治疗
    heal.cast({ x: 4, y: 4 });
    assert(f2.hp === 100);
  });

  it("minister - purge", () => {
    // 净化(不考虑视野遮挡)
    // 施法距离3格
    // 造成2点伤害
    let me = new Minister();
    me.color = ChessColor.red;
    me.position = { x: 2, y: 4 };
    chBoard.addChess(me);

    // 不满血的敌军
    let e1 = new Wood();
    e1.color = ChessColor.black;
    e1.position = { x: 1, y: 4 };
    e1.hp = 20;
    e1.maxhp = 100;
    chBoard.addChess(e1);

    let e2 = new Wood();
    e2.color = ChessColor.black;
    e2.position = { x: 0, y: 4 };
    e2.hp = 20;
    e2.maxhp = 100;
    chBoard.addChess(e2);

    let purge = me.skillList.find(sk => sk.type == SkillType.purge);
    // 施放目标
    {
      let exp = [{ x: 1, y: 4 }, { x: 0, y: 4 }];
      assert.deepEqual(purge.getCastRange().sort(sort), exp.sort(sort));
    }

    // 施法
    {
      purge.cast({ x: 0, y: 4 });
      assert(e1.hp === 18);
      assert(e2.hp === 18);
    }
  });

  it("magic - moveRange", () => {
    // 移动范围
    // 闪现,不会被视野遮挡
    let me = new Magic();
    me.color = ChessColor.red;
    me.position = { x: 1, y: 2 };
    chBoard.addChess(me);

    let ch = new Wood();
    ch.color = ChessColor.black;
    ch.position = { x: 1, y: 3 };
    chBoard.addChess(ch);

    let range = me.getMoveRange();
    let exp = [
      // 这个是棋子的位置,所以肯定不会是magic可以行走的位置
      // {x:1,y:3},
      { x: 1, y: 4 },
      { x: 1, y: 5 },
      { x: 1, y: 6 },

      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },

      { x: 1, y: 1 },
      { x: 1, y: 0 },

      { x: 0, y: 2 },
      //

      { x: 0, y: 1 },

      { x: 0, y: 3 },

      { x: 2, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 5 },

      { x: 2, y: 1 },
      { x: 3, y: 0 }
    ];
    assert.deepEqual(range.sort(sort), exp.sort(sort));
  });

  it("magic - fire - out eye", () => {
    // 火球(考虑视野遮挡)
    let me = new Magic();
    me.color = ChessColor.red;
    me.position = { x: 1, y: 2 };
    chBoard.addChess(me);

    let e1 = new Wood();
    e1.color = ChessColor.black;
    e1.hp = 20;
    e1.position = { x: 1, y: 3 };
    chBoard.addChess(e1);

    let e2 = new Wood();
    e2.color = ChessColor.black;
    e2.position = { x: 1, y: 5 };
    chBoard.addChess(e2);

    let fire = me.skillList.find(sk => sk.type == SkillType.fire);
    {
      let exp = [{ x: 1, y: 3 }];
      assert.deepEqual(fire.getCastRange().sort(sort), exp.sort(sort));
    }

    {
      fire.cast({ x: 1, y: 3 });
      let exp = 12;
      assert(e1.hp === exp);
    }
  });

  it("magic - nova", () => {
    // 冰霜新星
    let me = new Magic();
    me.color = ChessColor.red;
    me.position = { x: 1, y: 2 };
    chBoard.addChess(me);

    let e1 = new Wood();
    e1.color = ChessColor.black;
    e1.position = { x: 1, y: 3 };
    e1.hp = 20;
    chBoard.addChess(e1);

    let e2 = new Wood();
    e2.color = ChessColor.black;
    e2.position = { x: 1, y: 4 };
    e2.hp = 20;
    chBoard.addChess(e2);

    let e3 = new Wood();
    e3.color = ChessColor.black;
    e3.position = { x: 1, y: 5 };
    e3.hp = 20;
    chBoard.addChess(e3);

    let nova = me.skillList.find(sk => sk.type == SkillType.nova);
    assert.deepEqual(nova.getCastRange().sort(sort), [{ x: 1, y: 2 }]);

    nova.cast({ x: 1, y: 2 });
    assert(e1.hp === 14);
    assert(e2.hp === 14);
    assert(e3.hp === 20);
  });

  it("king", () => {
    // 顺势斩
    // 需要有正对的目标供king使用
    let me = new King();
    me.color = ChessColor.red;
    me.position = { x: 1, y: 2 };
    chBoard.addChess(me);

    let e1 = new Wood();
    e1.color = ChessColor.black;
    e1.position = { x: 1, y: 3 };
    e1.hp = 20;
    chBoard.addChess(e1);

    let e2 = new Wood();
    e2.color = ChessColor.black;
    e2.position = { x: 2, y: 3 };
    e2.hp = 20;
    chBoard.addChess(e2);

    let cleave = me.skillList.find(sk => sk.type == SkillType.cleave);
    assert.deepEqual(
      cleave.getCastRange().sort(sort),
      [{ x: 1, y: 3 }].sort(sort)
    );

    cleave.cast({ x: 1, y: 3 });
    assert(e1.hp === 14);
    assert(e2.hp === 14);
  });
});
