import * as api from "../api";
import ChessBoard from "../chessBoard/chessBoard";
import Skill from "../skill/skill";
import {
  ChessColor,
  ChessStatus,
  ChessType,
  IChessInfo,
  IPosition,
  SkillType
} from "../types";
import chessList from "./chessList";

// 棋子基类
export default abstract class Chess {
  id: string;
  color: ChessColor;
  type: ChessType;
  position: IPosition;
  hp: number;
  maxhp: number;
  status: ChessStatus;
  skillList: Skill[];
  energy: number;
  chessBoard: ChessBoard;

  // 增加技能
  addSkill(sk: Skill) {
    this.skillList.push(sk);
    sk.owner = this;
  }

  // 获得可以移动的坐标列表(理论上)
  protected abstract getMoveRangeOnPurpose(): IPosition[];
  // 获得可以移动的坐标列表(实际上)
  getMoveRange(): IPosition[] {
    return (
      this.getMoveRangeOnPurpose()
        // 过滤掉不在棋盘中的
        .filter(this.inChessBoardFilter)
        // 过滤掉已经被占据的格子
        .filter(this.hasChessFilter)
    );
  }

  // 获取可以施放技能的格子
  getCastRange(skillType: SkillType): IPosition[] {
    let sk = this.skillList.find(sk => sk.type === skillType);
    if (!sk) {
      return [];
    }
    return sk.getCastRange().filter(this.inChessBoardFilter);
  }

  // 施放技能
  cast(skType: SkillType, position: IPosition): void {
    let sk = this.skillList.find(sk => sk.type === skType);
    sk.cast(position);
  }

  // 设置生命值
  setHp(hp: number): void {
    this.hp = hp < 0 ? 0 : hp > this.maxhp ? this.maxhp : hp;
  }

  // 休息
  rest(): void {
    this.status = ChessStatus.rest;
  }

  // 棋子死亡
  dead(): void {}

  //
  round(): void {
    this.status = ChessStatus.beforeChoose;
  }

  // 移动
  move(position: IPosition): void {
    this.position = position;

    // 如果有技能可以cast,状态为beforeCast
    if (this.canCastSkillList.length) {
      this.status = ChessStatus.beforeCast;
    } else {
      // 否则直接进入休息
      this.rest();
    }
  }

  public get canCastSkillList(): Skill[] {
    if (
      [ChessStatus.beforeMove, ChessStatus.beforeCast].indexOf(this.status) ===
      -1
    ) {
      return [];
    }
    return this.skillList.filter(sk => this.getCastRange(sk.type).length);
  }

  // 棋盘边界过滤器
  private inChessBoardFilter = (position: IPosition) => {
    return this.chessBoard.isInChessBoard(position);
  };

  // 已经占据的格子过滤器
  // 一个格子里不能有2个棋子
  // true 表示没有其他的棋子占据
  private hasChessFilter = (position: IPosition) => {
    return !this.chessBoard.chessList.find(
      ch => ch.position.x == position.x && ch.position.y == position.y
    );
  };

  constructor() {
    this.id = Math.random()
      .toString()
      .slice(2);
    this.status = ChessStatus.beforeChoose;
    this.skillList = [];

    this.maxhp = this.hp;
  }

  destory(): void {}

  toString(): IChessInfo {
    let info: IChessInfo = {
      chessBoardId: this.chessBoard.id,
      color: this.color,
      energy: this.energy,
      hp: this.hp,
      id: this.id,
      maxhp: this.maxhp,
      position: { ...this.position },
      status: this.status,
      type: this.type
    };
    return info;
  }

  parse(info: IChessInfo, chBoard: ChessBoard): void {
    this.id = info.id;
    this.type = info.type;
    this.color = info.color;
    this.position = info.position;
    this.hp = info.hp;
    this.maxhp = info.maxhp;
    this.status = info.status;
    this.energy = info.energy;
    this.chessBoard = chBoard;
  }
}
