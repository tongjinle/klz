import { genUniqueId } from "./api";
import Chess from "./chess/chess";
import chessList from "./chess/chessList";
import ChessBoard from "./chessBoard/chessBoard";
import {
  ActionType,
  ChessColor,
  ChessType,
  IPosition,
  IRecord,
  PlayerStatus,
  SkillType
} from "./types";
import {
  AddPlayerRecord,
  SetMapSeedRecord,
  SetMapSizeRecord,
  SetMapNameRecord,
  SetMapChessRecord,
  AddChessRecord,
  RemoveChessRecord,
  ChooseChessRecord,
  MoveChessRecord,
  CastSkillRecord,
  ChooseSkillRecord
} from "./recordTypes";

export default class Replay {
  constructor() {
    this.id = genUniqueId();
    this.recordList = [];
  }

  id: string;
  seed: number;
  chessBoard: ChessBoard;
  recordList: IRecord[];
  parse(record: IRecord): void {
    this.chessBoard = this.chessBoard || new ChessBoard();

    this.parseDict[record.actionType](record.data);
    this.recordList.push(record);
  }

  query(round: number, action: ActionType): IRecord[] {
    let rst: IRecord[] = [];
    rst = this.recordList
      .filter(reco => reco.round == round)
      .filter(reco => reco.actionType == action);
    return rst;
  }

  private parseDict: { [action: string]: (data: any) => void } = {
    ["addPlayer"]: (data: AddPlayerRecord) => {
      this.chessBoard.addPlayer(data.red, "red");
      this.chessBoard.addPlayer(data.black, "black");
      this.chessBoard.start();
    },
    ["setMapSeed"]: (data: SetMapSeedRecord) => {
      this.chessBoard.setMapSeed(data.seed);
    },
    ["setMapSize"]: (data: SetMapSizeRecord) => {
      this.chessBoard.setMapSize(data.width, data.height);
    },

    ["setMapChess"]: (data: SetMapChessRecord) => {
      this.chessBoard.setMapChess(data.chessList);
    },

    ["readMap"]: (data: SetMapNameRecord) => {
      this.chessBoard.readMap(data.mapName);
    },

    ["addChess"]: (data: AddChessRecord) => {
      let ch: Chess = this.chessBoard.createChess(data.chessType);
      ch.color = data.chessColor;
      ch.position = data.position;
      this.chessBoard.addChess(ch);
    },
    ["removeChess"]: (data: RemoveChessRecord) => {
      this.chessBoard.removeChess(
        this.chessBoard.getChessByPosition(data.position)
      );
    },
    ["chooseChess"]: (data: ChooseChessRecord) => {
      let ch = this.chessBoard.getChessByPosition(data.position);
      this.chessBoard.chooseChess(ch);
    },
    ["moveChess"]: (data: MoveChessRecord) => {
      this.chessBoard.moveChess(data.position);
    },
    ["chooseSkill"]: (data: ChooseSkillRecord) => {
      this.chessBoard.chooseSkill(data.skillType);
    },
    ["castSkill"]: (data: CastSkillRecord) => {
      this.chessBoard.castSkill(data.position);
    },
    ["rest"]: () => {
      this.chessBoard.rest();
    }
  };
}
