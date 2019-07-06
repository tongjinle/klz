import {
  ISkillInfo,
  ChessRelationship,
  IPosition,
  IBox,
  IChessBoard,
  IChess,
  ISkill,
  IRecord,
  IPlayer,
  ChessColor,
  ChessType,
  ChessStatus,
  PlayerStatus,
  SkillType
} from "../types";
import * as api from "../api";
import skillList from "./skillList";
import Chess from "../chess/chess";
import { genUniqueId } from "../api";
import ChessBoard from "../chessBoard/chessBoard";

export default abstract class Skill {
  id: string;
  type: SkillType;
  // 技能所属的棋子
  owner: Chess;
  // cd
  maxcd: number;
  // 当前cd
  cd: number;

  // 获取可以施放技能的坐标列表(理论上)
  protected abstract getCastRangeOnPurpose(): IPosition[];
  // 获取可以施放技能的坐标列表
  getCastRange(): IPosition[] {
    return this.getCastRangeOnPurpose().filter(this.inChessBoardFilter);
  }

  protected friendFilter(position: IPosition): boolean {
    let ch = this.owner.chessBoard.getChessByPosition(position);
    return ch ? ch.color === this.owner.color : false;
  }

  protected enemyFilter(position: IPosition): boolean {
    let ch = this.owner.chessBoard.getChessByPosition(position);
    return ch ? ch.color !== this.owner.color : false;
  }

  // 冷却
  cooldown: () => void;

  // 施放
  abstract cast(posiTarget: IPosition): void;

  // 棋盘边界过滤器
  // true 表示在棋盘中
  private inChessBoardFilter(position: IPosition): boolean {
    return api.chessBoardApi.isInChessBoard(this.owner.chessBoard, position);
  }

  // 遮挡过滤器
  // 查询pa是否有pb的视野
  // 如果在pa跟pb之间,有其他的chess,那么pa就没有视野
  // true 表示视野没有被遮挡
  protected inChessShadowFilter(pa: IPosition, pb: IPosition): boolean {
    let range = api.rangeApi.getBetween(pa, pb);
    return !!range.find(po => !!this.owner.chessBoard.getChessByPosition(po));
  }

  // 棋子敌我过滤器
  // relationship表示敌我选择
  // true 表示可以被选择
  protected chessFilter(
    position: IPosition,
    rela?: ChessRelationship
  ): boolean {
    let ch = this.owner.chessBoard.getChessByPosition(position);
    if (ch) {
      if (rela == ChessRelationship.enemy) {
        return ch.color != this.owner.color;
      } else if (rela == ChessRelationship.firend) {
        return ch.color == this.owner.color;
      } else {
        return true;
      }
    }
    return false;
  }

  constructor() {
    this.id = genUniqueId();
  }

  static createSkillByType(skillType: SkillType): Skill {
    return new skillList[skillType]();
  }

  toString(): ISkillInfo {
    let info: ISkillInfo = {
      id: this.id,
      cd: this.cd,
      maxcd: this.maxcd,
      ownerId: this.owner.id,
      type: this.type
    };
    return info;
  }

  parse(info: ISkillInfo, chBoard: ChessBoard): void {
    this.id = info.id;
    this.cd = info.cd;
    this.maxcd = info.maxcd;
    this.owner = chBoard.chessList.find(ch => ch.id == info.ownerId);
    this.type = info.type;
  }
}
