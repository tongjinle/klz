import * as api from "../api";
import { genUniqueId } from "../api";
import ChangeTable from "../changeTable";
import Chess from "../chess/chess";
import chessList from "../chess/chessList";
import { conf } from "../conf";
import maps from "../maps";
import Player from "../player/player";
import Replay from "../replay";
import Skill from "../skill/skill";
import {
  ActionType,
  ChangeType,
  ChessBoardJudge,
  ChessBoardStatus,
  ChessColor,
  ChessStatus,
  ChessType,
  IBox,
  IChange,
  IChessBoardInfo,
  IMap,
  IPlayer,
  IPosition,
  PlayerStatus,
  RestType,
  SkillType
} from "../types";

class ChessBoard {
  private maxEnergy = conf.MAX_ENERGY;
  private activeRestEnergy = conf.ACTIVE_REST_ENERGY;
  private passiveRestEnergy = conf.PASSIVE_REST_ENERGY;

  constructor() {
    this.id = genUniqueId();
    this.roundIndex = 0;
    this.chessList = [];
    this.boxList = [];
    this.playerList = [];
    this.status = ChessBoardStatus.beforeStart;
    this.rep = new Replay();
    this.chgTable = new ChangeTable();
  }

  id: string;
  mapName: string;
  rep: Replay;
  chgTable: ChangeTable;

  seed: number;
  roundIndex: number;
  boxList: IBox[];
  chessList: Chess[];
  width: number;
  height: number;
  status: ChessBoardStatus;
  winColor: ChessColor;
  // 双方选手
  playerList: IPlayer[];

  // 当前行棋方名字
  currPlayerName: string;

  // 当前行棋方
  public get currPlayer(): IPlayer {
    return this.playerList.find(p => p.name == this.currPlayerName);
  }

  public set currPlayer(v: IPlayer) {
    this.currPlayerName = v.name;
  }

  public currChess: Chess;
  public currSkill: Skill;

  snapshot: IChessBoardInfo;

  // 方法
  // ***************************************************

  // 记录rep
  writeRecord(action: ActionType, data: any) {
    this.rep.recoList.push({
      round: this.roundIndex,
      action,
      data
    });
  }

  // 记录change
  writeChange(cht: ChangeType, data: any) {
    let chg: IChange<{}> = {
      round: this.roundIndex,
      playerName: this.currPlayer.name,
      type: cht,
      detail: data
    };
    this.chgTable.recoList.push(chg);
  }

  readMap(mapName: string) {
    let map: IMap = maps[mapName];
    this.mapName = mapName;
    this.setMapSeed(map.seed);
    this.setMapSize(map.width, map.height);
    this.setMapChess(map.chessList);
  }

  // 设置随机种子
  setMapSeed(seed: number) {
    this.seed = seed;

    this.writeRecord(ActionType.setMapSeed, { seed });
  }

  // 设置棋盘尺寸
  setMapSize(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.writeRecord(ActionType.setMapSize, { width, height });
  }

  // 初始化游戏
  // 默认的mapName为默认
  setMapChess(
    chessList: {
      chessType: ChessType;
      color: ChessColor;
      position: IPosition;
    }[]
  ) {
    chessList.forEach(d => {
      let ch = api.chessApi.create(d.chessType);
      api.chessApi.setColor(ch, d.color);
      api.chessApi.setPosition(ch, d.position);
      this.addChess(ch);

      this.writeRecord(ActionType.addChess, {
        chessType: d.chessType,
        position: d.position,
        chessColor: d.color
      });
    });
  }

  // 增加选手
  addPlayer(playerName: string): boolean {
    const MAX_PLAYER_COUNT = conf.MAX_PLAYER_COUNT;
    let pList = this.playerList;
    let color: ChessColor;
    let p: IPlayer;
    if (pList.length == 2) {
      return false;
    }

    color = pList.length == 0 ? ChessColor.red : ChessColor.black;

    p = new Player();
    p.name = playerName;
    p.color = color;
    p.status = PlayerStatus.notReady;
    p.chessStatus = ChessStatus.rest;
    p.energy = conf.PLAYER_ENERGY;

    this.playerList.push(p);
    return true;
  }

  // 删除选手
  removePlayer(playerName: string): boolean {
    let pList = this.playerList;
    let p = this.getPlayerByName(playerName);
    if (p) {
      this.playerList = pList.filter(p => p.name != playerName);
      return true;
    }
    return false;
  }

  addChess(chess: Chess): void {
    this.chessList.push(chess);
    chess.chessBoard = this;
  }

  removeChess(chess: Chess): void {
    this.chessList = this.chessList.filter(ch => ch.id != chess.id);
    chess.destory();
  }

  // 选手准备/反准备
  ready(pName: string, status: PlayerStatus): void {
    let p = this.playerList.find(p => p.name == pName);
    p.status = status;

    // 是否都准备完毕
    if (this.canStart()) {
      this.writeRecord(ActionType.addPlayer, {
        red: this.playerList.find(p => p.color == ChessColor.red).name,
        black: this.playerList.find(p => p.color == ChessColor.black).name
      });

      this.start();
    }
  }

  // 是否可以开始游戏
  private canStart(): boolean {
    return (
      this.playerList.length == 2 &&
      this.playerList.every(p => p.status == PlayerStatus.ready)
    );
  }

  // 开始游戏
  start() {
    this.snapshot = this.toString();

    this.status = ChessBoardStatus.red;
    let p = this.playerList.find(p => p.color == ChessColor.red);
    this.round(p.name);
  }

  // 选手获得行动机会
  // 确定选手名字,则轮到该选手
  // 如果没有明确选手名字
  // 1.如果是第一回合,则红色下棋;
  // 2.如果不是第一个回合,则交换为对手下棋
  round(playerName?: string) {
    let p: IPlayer;
    let lastP: IPlayer = this.currPlayer;

    // 清理
    if (this.currPlayer) {
      this.currPlayer.status = PlayerStatus.waiting;
      this.currPlayer.chessStatus = ChessStatus.rest;
    }
    if (this.currChess) {
      this.currChess.status = ChessStatus.rest;
      this.currChess = undefined;
    }
    if (this.currSkill) {
      this.currSkill = undefined;
    }

    // 下一个选手
    if (playerName) {
      this.currPlayerName = playerName;
      p = this.getPlayerByName(playerName);
    } else {
      if (lastP) {
        p = this.playerList.find(p => p != lastP);
        // console.log('交换选手下棋',p);
      } else {
        p = this.playerList.find(p => p.color == ChessColor.red);
      }
    }

    if (p) {
      p.status = PlayerStatus.thinking;
      p.chessStatus = ChessStatus.beforeChoose;
      this.currPlayer = p;
      this.status = ChessBoardStatus[ChessColor[p.color]];
    }

    this.roundIndex++;
  }

  // 获取可以被选择的棋子
  getActiveChessList(): Chess[] {
    let p = this.currPlayer;

    return this.chessList
      .filter(ch => ch.color == p.color)
      .filter(ch => ch.energy <= p.energy)
      .filter(
        ch =>
          ch.getMoveRange().length > 0 ||
          // false
          !!ch.skillList.find(sk => ch.getCastRange(sk.type).length > 0)
      );
  }

  canChooseChess(chess: Chess) {
    // 判断是否可以选择
    return this.getActiveChessList().find(ch => ch === chess);
  }
  // 选手选择棋子
  chooseChess(chess: Chess) {
    //  当前棋子的状态为"beforeMove"
    this.currChess = chess;
    // todo 疑惑,有可能是直接成为beforeCast
    this.currChess.status = ChessStatus.beforeMove;
    // 玩家状态也改变为"beforeMove"
    this.currPlayer.chessStatus = ChessStatus.beforeMove;
  }

  unChooseChess() {
    this.currPlayer.chessStatus = ChessStatus.beforeChoose;
    if (this.currChess) {
      this.currChess.status = ChessStatus.beforeChoose;
      this.currChess = undefined;
    }
    if (this.currSkill) {
      this.currSkill = undefined;
    }
  }

  // 选手移动棋子
  moveChess(position: IPosition) {
    let ch = this.currChess;
    let lastPosi = { ...ch.position };
    ch.move(position);

    // 必须在rest前做好replay记录
    // 否则round会成为2
    this.writeRecord(ActionType.chooseChess, {
      position: { ...lastPosi }
    });
    this.writeRecord(ActionType.moveChess, {
      position: { ...position }
    });

    // 记录change
    this.writeChange(ChangeType.position, {
      sourceChessId: this.currChess.id,
      abs: { ...position },
      rela: { x: position.x - lastPosi.x, y: position.y - lastPosi.y }
    });

    this.currPlayer.chessStatus = ch.status;
    if (this.currPlayer.chessStatus === ChessStatus.rest) {
      this.rest();
    }
  }

  // 选手选择技能
  chooseSkill(skType: SkillType) {
    this.currSkill = this.currChess.skillList.find(sk => sk.type === skType);
  }

  // 能否反选技能
  canUnchooseSkill(): boolean {
    return !!this.currSkill;
  }

  // 选手反选技能
  unchooseSkill() {
    this.currSkill = undefined;
  }

  //   canCanChooseSkillTarget(position: IPosition):boolean {
  // return this.currChess && this.currSkill && !!this.currSkill.getCastRange().find(        po => po.x === position.x && po.y === position.y)
  // 	}

  // 选手选择技能目标
  chooseSkillTarget(posi: IPosition) {
    //   let lastChessHpDict = getChessHpDict(this.chessList);
    //   this.currSkill.cast(posi);
    // 	let currChessHpDict = getChessHpDict(this.chessList);

    // 	for(v of currChessHpDict){

    // 	}
    //   currChessHpDict.forEach( (v, k) => {
    //     if (v != lastChessHpDict[k]) {
    //       this.writeChange(ChangeType.hp, {
    //         sourceChessId: this.currChess.id,
    //         targetChessId: k,
    //         skillId: this.currSkill.id,
    //         abs: v,
    //         rela: v - lastChessHpDict[k]
    //       });
    //     }
    //   });

    //   // 移除死亡的棋子
    //   this.chessList = _.filter(this.chessList, ch => ch.hp > 0);

    //   this.writeRecord(ActionType.chooseSkill, {
    //     skillType: this.currSkill.type
    //   });
    //   this.writeRecord(ActionType.castSkill, { position: _.clone(posi) });

    //   this.currSkill = undefined;
    //   this.currChess.status = ChessStatus.rest;
    //   this.currPlayer.chessStatus = ChessStatus.rest;
    //   this.currPlayer.status = PlayerStatus.waiting;

    //   this.rest();
    // }

    function getChessHpDict(chessList: Chess[]): { [chessId: string]: number } {
      var dict: { [chessId: string]: number } = {};
      chessList.forEach(ch => {
        dict[ch.id] = ch.hp;
      });
      return dict;
    }
  }

  // 选手休息
  rest() {
    let lastEnergy: number = this.currPlayer.energy;
    let restType: RestType;
    // 玩家
    // 如果玩家下过棋
    if (this.currPlayer.chessStatus == ChessStatus.rest) {
      this.currPlayer.energy -= this.currChess.energy;
      this.currPlayer.energy += this.passiveRestEnergy;

      restType = RestType.passive;
    } else if (this.currPlayer.chessStatus == ChessStatus.beforeChoose) {
      this.currPlayer.energy += this.activeRestEnergy;

      restType = RestType.active;

      // write replay
      this.writeRecord(ActionType.rest, undefined);
    }

    // write change
    this.writeChange(ChangeType.energy, {
      abs: this.currPlayer.energy,
      rela: this.currPlayer.energy - lastEnergy,
      restType
    });

    this.round();
  }

  // 选手投降
  surrender(playerName): ChessBoardStatus {
    // 不合法的玩家投降
    let player = this.playerList.find(p => p.name == playerName);
    if (!player) {
      return;
    }
    // 非进行中的棋局
    if (
      this.status != ChessBoardStatus.red &&
      this.status != ChessBoardStatus.black
    ) {
      return;
    }

    this.status = ChessBoardStatus.gameOver;
    this.winColor =
      player.color == ChessColor.red ? ChessColor.black : ChessColor.red;
    return this.status;
  }

  // 胜负判断
  judge(): ChessBoardJudge {
    if (this.winColor == ChessColor.red) {
      return ChessBoardJudge.red;
    } else if (this.winColor == ChessColor.black) {
      return ChessBoardJudge.black;
    }

    let redChessCount = this.chessList.filter(ch => ch.color == ChessColor.red)
      .length;
    let blackChessCount = this.chessList.filter(
      ch => ch.color == ChessColor.black
    ).length;

    if (redChessCount == 0 && blackChessCount == 0) {
      return ChessBoardJudge.equal;
    } else if (redChessCount == 0) {
      return ChessBoardJudge.black;
    } else if (blackChessCount == 0) {
      return ChessBoardJudge.red;
    }

    return ChessBoardJudge.none;
  }

  parse(info: string): void {
    let chBoardInfo: IChessBoardInfo = JSON.parse(info) as IChessBoardInfo;
    this.id = chBoardInfo.id;
    this.mapName = chBoardInfo.mapName;
    this.seed = chBoardInfo.seed;
    this.width = chBoardInfo.width;
    this.height = chBoardInfo.height;
    this.status = chBoardInfo.status;
    this.winColor = chBoardInfo.winColor;

    this.chessList = chBoardInfo.chessList.map(chInfo => {
      let ch = new chessList[chInfo.type]();
      ch.parse(chInfo, this);
      return ch;
    });

    this.playerList = chBoardInfo.playerList.map(pInfo => {
      let p = new Player();
      p.parse(pInfo);
      return p;
    });

    this.currPlayer = this.playerList.find(
      p => p.name == chBoardInfo.currPlayerName
    );
    this.currChess = this.chessList.find(
      ch => ch.id == chBoardInfo.currChessId
    );
    this.currSkill = this.currChess
      ? this.currChess.skillList.find(sk => sk.id == chBoardInfo.currSkillId)
      : undefined;
  }

  toString(): IChessBoardInfo {
    let info: IChessBoardInfo = {} as IChessBoardInfo;

    info.id = this.id;
    info.mapName = this.mapName;
    info.seed = this.seed;
    info.roundIndex = this.roundIndex;
    info.width = this.width;
    info.height = this.height;
    info.status = this.status;
    info.winColor = this.winColor;
    info.chessList = this.chessList.map(ch => ch.toString());
    info.playerList = this.playerList.map(p => p.toString());
    info.skillList = this.currChess
      ? this.currChess.skillList.map(sk => sk.toString())
      : [];
    info.currPlayerName = this.currPlayer ? this.currPlayer.name : undefined;
    info.currChessId = this.currChess ? this.currChess.id : undefined;
    info.currSkillId = this.currSkill ? this.currSkill.id : undefined;

    return info;
  }

  // 通过选手名字找选手
  getPlayerByName(pName: string): IPlayer {
    return this.playerList.find(p => p.name == pName);
  }

  // 通过坐标找棋子
  getChessByPosition(position: IPosition) {
    return this.chessList.find(
      ch => ch.position.x == position.x && ch.position.y == position.y
    );
  }
}

export default ChessBoard;
