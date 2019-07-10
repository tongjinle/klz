import { genUniqueId } from "../api";
import ChangeTable from "../changeTable";
import Chess from "../chess/chess";
import chessList from "../chess/chessList";
import { conf } from "../config";
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
    this.replay = new Replay();
    this.replay.chessBoard = this;
    this.chgTable = new ChangeTable();
  }

  id: string;
  mapName: string;
  replay: Replay;
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
  playerList: Player[];

  // 当前行棋方名字
  currPlayerName: string;

  // 当前行棋方
  public get currPlayer(): Player {
    return this.playerList.find(p => p.name == this.currPlayerName);
  }

  public set currPlayer(v: Player) {
    this.currPlayerName = v.name;
  }

  public currChess: Chess;
  public currSkill: Skill;

  snapshot: IChessBoardInfo;

  // 记录rep
  writeRecord(action: ActionType, data: any) {
    this.replay.recordList.push({
      round: this.roundIndex,
      actionType: action,
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

  // 读取地图
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
      let ch = this.createChess(d.chessType);

      ch.color = d.color;
      ch.position = d.position;
      this.addChess(ch);

      this.writeRecord(ActionType.addChess, {
        chessType: d.chessType,
        position: d.position,
        chessColor: d.color
      });
    });
  }

  // 能否增加选手
  // 1 棋盘已经到达了最大选手数量,不能增加
  // 2 选手不能同名
  // 3 选手颜色不能相同
  // 4 棋盘的状态已经不是"开始前"""
  canAddPlayer(playerName: string, color: ChessColor): boolean {
    const MAX_PLAYER_COUNT = conf.MAX_PLAYER_COUNT;

    if (this.playerList.length === MAX_PLAYER_COUNT) {
      return false;
    }

    if (this.playerList.find(p => p.name === playerName)) {
      return false;
    }

    if (this.playerList.find(p => p.color === color)) {
      return false;
    }

    if (this.status !== ChessBoardStatus.beforeStart) {
      return false;
    }

    return true;
  }

  // 增加选手
  addPlayer(playerName: string, color: ChessColor): void {
    let p: Player;

    p = new Player();
    p.name = playerName;
    p.color = color;
    p.status = PlayerStatus.notReady;
    p.chessStatus = ChessStatus.rest;
    p.energy = conf.PLAYER_ENERGY;

    this.playerList.push(p);
  }

  canRemovePlayer(playerName: string): boolean {
    return true;
  }

  // 删除选手
  removePlayer(playerName: string): void {
    let pList = this.playerList;
    this.playerList = pList.filter(p => p.name != playerName);
  }

  // 根据棋子类型,创建一个棋子
  createChess(type: ChessType): Chess {
    let ch: Chess = new chessList[type]();
    // id
    ch.id = genUniqueId();
    // type
    ch.type = type;
    // status
    ch.status = ChessStatus.rest;

    return ch;
  }

  // 增加一个棋子
  addChess(chess: Chess): void {
    this.chessList.push(chess);
    chess.chessBoard = this;
  }

  // 删除一个棋子
  removeChess(chess: Chess): void {
    this.chessList = this.chessList.filter(ch => ch.id != chess.id);
  }

  // 能否准备
  // 1 合法的选手
  // 2 棋盘的状态,必须为"开始前"
  canReady(
    playerName: string,
    status: PlayerStatus.ready | PlayerStatus.notReady
  ): boolean {
    if (!this.playerList.find(p => p.name == playerName)) {
      return false;
    }

    if (this.status !== ChessBoardStatus.beforeStart) {
      return false;
    }
    return true;
  }

  // 选手准备/反准备
  ready(
    playerName: string,
    status: PlayerStatus.ready | PlayerStatus.notReady
  ): void {
    let p = this.playerList.find(p => p.name == playerName);
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
      this.playerList.length == conf.MAX_PLAYER_COUNT &&
      this.playerList.every(p => p.status == PlayerStatus.ready)
    );
  }

  // 开始游戏
  start() {
    this.snapshot = this.toString();

    // 红色选手先走
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
    let p: Player;
    let lastP: Player = this.currPlayer;

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
    // 1 如果有指定,就用指定的
    // 2 否则,交换下棋
    // 3 无法计算交换,则红色选手
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

    return (
      this.chessList
        // 当前棋手的棋子
        .filter(ch => ch.color == p.color)
        // 行动力满足
        .filter(ch => ch.energy <= p.energy)
        // 有可行走的棋子 或者 有可施放技能的棋子
        .filter(
          ch =>
            ch.getMoveRange().length > 0 ||
            // false
            !!ch.skillList.find(sk => ch.getCastRange(sk.type).length > 0)
        )
    );
  }

  // 棋子是否可以被选择
  canChooseChess(chess: Chess): boolean {
    return !!this.getActiveChessList().find(ch => ch === chess);
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

  // 反选棋子
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

  // 能否选择技能
  canChooseSkill(): boolean {
    return (
      this.currPlayer &&
      this.currChess &&
      this.currChess.canCastSkillList.length > 0
    );
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
  unChooseSkill(): void {
    this.currSkill = undefined;
  }

  // 能否选择技能施放坐标
  canChooseSkillTarget(position: IPosition): boolean {
    return (
      this.currSkill &&
      !!this.currSkill
        .getCastRange()
        .find(posi => posi.x == position.x && posi.y == position.y)
    );
  }

  // 选手选择技能目标
  castSkill(posi: IPosition): void {
    let lastChessHpDict = getChessHpDict(this.chessList);
    this.currSkill.cast(posi);
    let currChessHpDict = getChessHpDict(this.chessList);

    // 记录生命值的变化
    for (let key in currChessHpDict) {
      let value = currChessHpDict[key];
      if (value != lastChessHpDict[key]) {
        this.writeChange(ChangeType.hp, {
          sourceChessId: this.currChess.id,
          targetChessId: key,
          skillId: this.currSkill.id,
          abs: value,
          rela: value - lastChessHpDict[key]
        });
      }
    }

    // 移除死亡的棋子
    this.chessList.filter(ch => ch.hp === 0).forEach(ch => ch.die());
    this.chessList = this.chessList.filter(ch => ch.hp > 0);

    this.writeRecord(ActionType.chooseSkill, {
      skillType: this.currSkill.type
    });
    this.writeRecord(ActionType.castSkill, { position: { ...posi } });

    this.currSkill = undefined;
    this.currChess.status = ChessStatus.rest;
    this.currPlayer.chessStatus = ChessStatus.rest;
    this.currPlayer.status = PlayerStatus.waiting;

    this.rest();

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
  surrender(playerName: string): void {
    let player = this.playerList.find(p => p.name == playerName);
    this.status = ChessBoardStatus.gameOver;
    this.winColor =
      player.color == ChessColor.red ? ChessColor.black : ChessColor.red;
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
  getPlayerByName(playerName: string): Player {
    return this.playerList.find(p => p.name == playerName);
  }

  // 通过坐标找棋子
  getChessByPosition(position: IPosition) {
    return this.chessList.find(
      ch => ch.position.x == position.x && ch.position.y == position.y
    );
  }

  // 棋盘边界筛子
  isInChessBoard = (position: IPosition) => {
    return (
      position.x >= 0 &&
      position.x < this.width &&
      position.y >= 0 &&
      position.y < this.height
    );
  };
}

export default ChessBoard;
