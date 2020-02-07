import { genUniqueId } from "../api";
import ChangeTable from "../changeTable";
import Chess from "../chess/chess";
import chessList from "../chess/chessList";
import {
  MAX_ENERGY,
  ACTIVE_REST_ENERGY,
  PASSIVE_REST_ENERGY,
  PLAYER_INIT_ENERGY
} from "../config";
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
  SkillType,
  EnergyChange,
  PositionChange,
  HpChange,
  UnionChange
} from "../types";

class ChessBoard {
  private maxEnergy = MAX_ENERGY;

  constructor() {
    this.id = genUniqueId();
    this.round = 0;
    this.chessList = [];
    this.boxList = [];
    this.playerList = [];
    this.status = "beforeStart";
    this.replay = new Replay();
    this.replay.chessBoard = this;
    this.changeTable = new ChangeTable();
  }

  /**唯一编号 */
  id: string;
  /**地图名字 */
  mapName: string;
  /**录像 */
  replay: Replay;
  /**数据更新表 */
  changeTable: ChangeTable;

  /**随机种子 */
  seed: number;
  /**回合 */
  round: number;
  /**格子列表 */
  boxList: IBox[];
  /**棋子列表 */
  chessList: Chess[];
  /**棋盘的宽度 */
  width: number;
  /**棋盘的高度 */
  height: number;
  /**棋盘状态 */
  status: ChessBoardStatus;
  /**获胜方颜色 */
  winColor: ChessColor;
  /**双方选手 */

  playerList: Player[];

  /**当前行棋方名字 */
  currentPlayerName: string;

  /**当前行棋方 */
  get currentPlayer(): Player {
    return this.playerList.find(p => p.name == this.currentPlayerName);
  }

  set currentPlayer(v: Player) {
    this.currentPlayerName = v.name;
  }

  /**当前棋子 */
  currentChess: Chess;
  /**当前技能 */
  currentSkill: Skill;

  /**快照 */
  snapshot: IChessBoardInfo;

  /**记录rep */
  writeRecord(action: ActionType, data: any) {
    this.replay.recordList.push({
      round: this.round,
      actionType: action,
      data
    });
  }

  /**记录change */
  writeChange(type: ChangeType, data: UnionChange) {
    let chg: IChange = {
      round: this.round,
      playerName: this.currentPlayer.name,
      type,
      data
    };
    this.changeTable.recordList.push(chg);
  }

  /**读取地图 */
  readMap(mapName: string) {
    let map: IMap = maps[mapName];
    this.mapName = mapName;
    this.setMapSeed(map.seed);
    this.setMapSize(map.width, map.height);
    this.setMapChess(map.chessList);
  }

  /**设置随机种子 */
  setMapSeed(seed: number) {
    this.seed = seed;

    this.writeRecord("setMapSeed", { seed });
  }

  /**设置棋盘尺寸 */
  setMapSize(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.writeRecord("setMapSize", { width, height });
  }

  /**初始化游戏的棋子 */
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

      this.writeRecord("addChess", {
        chessType: d.chessType,
        position: d.position,
        chessColor: d.color
      });
    });
  }

  /**增加选手 */
  addPlayer(playerName: string, color: ChessColor): void {
    let p: Player;

    p = new Player();
    p.name = playerName;
    p.color = color;
    p.status = "ready";
    p.isChooseRest = false;
    p.energy = PLAYER_INIT_ENERGY;

    this.playerList.push(p);
  }

  /**删除选手 */
  removePlayer(playerName: string): void {
    this.playerList = this.playerList.filter(p => p.name != playerName);
  }

  /**根据棋子类型,创建一个棋子 */
  createChess(type: ChessType): Chess {
    let ch: Chess = new chessList[type]();
    /**id */
    ch.id = genUniqueId();
    /**type */
    ch.type = type;
    /**status */
    ch.status = "rest";

    return ch;
  }

  /**增加一个棋子 */
  addChess(chess: Chess): void {
    this.chessList.push(chess);
    chess.chessBoard = this;
  }

  /**删除一个棋子 */
  removeChess(chess: Chess): void {
    this.chessList = this.chessList.filter(ch => ch.id != chess.id);
  }

  /**开始游戏 */
  start() {
    this.snapshot = this.toString();

    /**红色选手先走 */
    this.status = "red";
    let p = this.playerList.find(p => p.color === "red");
    this.turnRound(p.name);
  }

  /**选手获得行动机会 */
  /**确定选手名字,则轮到该选手 */
  /**如果没有明确选手名字 */
  /**1.如果是第一回合,则红色下棋; */
  /**2.如果不是第一个回合,则交换为对手下棋 */
  turnRound(playerName?: string) {
    let p: Player;
    let lastP: Player = this.currentPlayer;

    /**清理 */
    if (this.currentPlayer) {
      this.currentPlayer.status = "waiting";
      this.currentPlayer.isChooseRest = false;
    }
    if (this.currentChess) {
      this.currentChess.status = "rest";
      this.currentChess = undefined;
    }
    if (this.currentSkill) {
      this.currentSkill = undefined;
    }

    /**下一个选手 */
    /**1 如果有指定,就用指定的 */
    /**2 否则,交换下棋 */
    /**3 无法计算交换,则红色选手 */
    if (playerName) {
      this.currentPlayerName = playerName;
      p = this.getPlayerByName(playerName);
    } else {
      if (lastP) {
        p = this.playerList.find(p => p != lastP);
        /**console.log('交换选手下棋',p); */
      } else {
        p = this.playerList.find(p => p.color === "red");
      }
    }

    if (p) {
      p.status = "thinking";
      p.isChooseRest = false;
      this.currentPlayer = p;
      this.status = p.color;
    }

    this.round++;
  }

  /**获取可以被选择的棋子 */
  getActiveChessList(): Chess[] {
    let p = this.currentPlayer;

    return (
      this.chessList
        /**当前棋手的棋子 */
        .filter(ch => ch.color == p.color)
        /**行动力满足 */
        .filter(ch => ch.energy <= p.energy)
        /**有可行走的棋子 或者 有可施放技能的棋子 */
        .filter(
          ch =>
            ch.getMoveRange().length > 0 ||
            /**false */
            !!ch.skillList.find(sk => ch.getCastRange(sk.type).length > 0)
        )
    );
  }

  /**棋子是否可以被选择 */
  canChooseChess(chess: Chess): boolean {
    return !!this.getActiveChessList().find(ch => ch === chess);
  }

  /**选手选择棋子 */
  chooseChess(chess: Chess) {
    /** 当前棋子的状态为"beforeMove"或者"beforeCast" */
    this.currentChess = chess;
    let ch = this.currentChess;
    if (ch.getMoveRange().length > 0) {
      ch.status = "beforeMove";
    } else if (ch.activeSkillList.length > 0) {
      ch.status = "beforeCast";
    } else {
      throw "can not choose this chess";
    }
  }

  canUnchooseChess(): boolean {
    return true;
  }

  /**反选棋子 */
  unChooseChess() {
    this.currentChess.status = "beforeChoose";
    this.currentChess = undefined;
    this.currentSkill = undefined;
  }

  /**选手移动棋子 */
  moveChess(position: IPosition) {
    let ch = this.currentChess;
    let lastPosi = { ...ch.position };
    ch.move(position);

    /**必须在rest前做好replay记录 */
    /**否则round会成为+1 */
    this.writeRecord("chooseChess", {
      position: { ...lastPosi }
    });
    this.writeRecord("moveChess", {
      position: { ...position }
    });

    /**记录change */
    let change: PositionChange = {
      sourceChessId: this.currentChess.id,
      abs: { ...position },
      rela: { x: position.x - lastPosi.x, y: position.y - lastPosi.y }
    };
    this.writeChange("position", change);

    // 判断棋子状态是不是成为rest
    // 如果是rest,则没有机会施放技能,所以自动进入玩家的rest状态
    if (this.currentChess.status === "rest") {
      this.rest();
    }
  }

  /**能否选择技能 */
  canChooseSkill(): boolean {
    return (
      this.currentPlayer &&
      this.currentChess &&
      this.currentChess.activeSkillList.length > 0
    );
  }

  /**选手选择技能 */
  chooseSkill(skType: SkillType) {
    this.currentSkill = this.currentChess.skillList.find(
      sk => sk.type === skType
    );
  }

  /**能否反选技能 */
  canUnchooseSkill(): boolean {
    return !!(
      this.currentPlayer &&
      this.currentChess &&
      this.currentChess.status === "beforeCast" &&
      this.currentSkill
    );
  }

  /**选手反选技能 */
  unChooseSkill(): void {
    this.currentSkill = undefined;
  }

  /**能否选择技能施放坐标 */
  canChooseSkillTarget(position: IPosition): boolean {
    // 存在当前技能
    // 目标位置在技能施法位置列表中
    return (
      this.currentSkill &&
      !!this.currentSkill
        .getCastRange()
        .find(posi => posi.x == position.x && posi.y == position.y)
    );
  }

  /**选手选择技能目标 */
  castSkill(posi: IPosition): void {
    let lastChessHpDict = getChessHpDict(this.chessList);
    this.currentSkill.cast(posi);
    let currentChessHpDict = getChessHpDict(this.chessList);

    /**记录生命值的变化 */
    for (let key in currentChessHpDict) {
      let value = currentChessHpDict[key];
      if (value != lastChessHpDict[key]) {
        let change: HpChange = {
          sourceChessId: this.currentChess.id,
          targetChessId: key,
          skillId: this.currentSkill.id,
          abs: value,
          rela: value - lastChessHpDict[key]
        };
        this.writeChange("hp", change);
      }
    }

    /**移除死亡的棋子 */
    this.chessList.filter(ch => ch.hp === 0).forEach(ch => ch.die());
    this.chessList = this.chessList.filter(ch => ch.hp > 0);

    this.writeRecord("chooseSkill", {
      skillType: this.currentSkill.type
    });
    this.writeRecord("castSkill", { position: { ...posi } });

    this.rest();

    // 辅助函数
    function getChessHpDict(chessList: Chess[]): { [chessId: string]: number } {
      var dict: { [chessId: string]: number } = {};
      chessList.forEach(ch => {
        dict[ch.id] = ch.hp;
      });
      return dict;
    }
  }

  /**选手休息 */
  rest() {
    let lastEnergy: number = this.currentPlayer.energy;
    let restType: RestType;
    /**玩家 */
    /**如果玩家下过棋 */
    if (!this.currentPlayer.isChooseRest) {
      this.currentPlayer.energy -= this.currentChess.energy;
      this.currentPlayer.energy += PASSIVE_REST_ENERGY;

      restType = "passive";
    } else {
      this.currentPlayer.energy += ACTIVE_REST_ENERGY;

      restType = "active";

      /**  write replay */
      /**this.writeRecord(ActionType.rest, undefined); */
    }

    /**write change */
    let change: EnergyChange = {
      abs: this.currentPlayer.energy,
      rela: this.currentPlayer.energy - lastEnergy,
      restType
    };
    this.writeChange("energy", change);

    this.turnRound();
  }

  /**选手投降 */
  surrender(playerName: string): void {
    let player = this.playerList.find(p => p.name == playerName);
    this.status = "gameOver";
    this.winColor = player.color == "red" ? "black" : "red";
  }

  /**胜负判断 */
  judge(): ChessBoardJudge {
    // 已经有胜利方(eg:由一方的投降而得到)
    if (this.winColor == "red") {
      return "red";
    } else if (this.winColor == "black") {
      return "black";
    }

    // 查看还有多少棋子,一方没有棋子了,就决出了胜负
    let redChessCount = this.chessList.filter(ch => ch.color == "red").length;
    let blackChessCount = this.chessList.filter(ch => ch.color == "black")
      .length;

    if (redChessCount == 0 && blackChessCount == 0) {
      return "equal";
    } else if (redChessCount == 0) {
      return "black";
    } else if (blackChessCount == 0) {
      return "red";
    }

    return "none";
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

    this.currentPlayer = this.playerList.find(
      p => p.name == chBoardInfo.currentPlayerName
    );
    this.currentChess = this.chessList.find(
      ch => ch.id == chBoardInfo.currentChessId
    );
    this.currentSkill = this.currentChess
      ? this.currentChess.skillList.find(
          sk => sk.id == chBoardInfo.currentSkillId
        )
      : undefined;
  }

  toString(): IChessBoardInfo {
    let info: IChessBoardInfo = {} as IChessBoardInfo;

    info.id = this.id;
    info.mapName = this.mapName;
    info.seed = this.seed;
    info.roundIndex = this.round;
    info.width = this.width;
    info.height = this.height;
    info.status = this.status;
    info.winColor = this.winColor;
    info.chessList = this.chessList.map(ch => ch.toString());
    info.playerList = this.playerList.map(p => p.toString());
    info.skillList = this.currentChess
      ? this.currentChess.skillList.map(sk => sk.toString())
      : [];
    info.currentPlayerName = this.currentPlayer
      ? this.currentPlayer.name
      : undefined;
    info.currentChessId = this.currentChess ? this.currentChess.id : undefined;
    info.currentSkillId = this.currentSkill ? this.currentSkill.id : undefined;

    return info;
  }

  /**通过选手名字找选手 */
  getPlayerByName(playerName: string): Player {
    return this.playerList.find(p => p.name == playerName);
  }

  /**通过坐标找棋子 */
  getChessByPosition(position: IPosition) {
    return this.chessList.find(
      ch => ch.position.x == position.x && ch.position.y == position.y
    );
  }

  /**棋盘边界筛子 */
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
