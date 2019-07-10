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
    [ActionType.addPlayer]: (data: AddPlayerRecord) => {
      this.chessBoard.addPlayer(data.red, ChessColor.red);
      this.chessBoard.addPlayer(data.black, ChessColor.black);

      this.chessBoard.ready(data.red, PlayerStatus.ready);
      this.chessBoard.ready(data.black, PlayerStatus.ready);
    },
    [ActionType.setMapSeed]: (data: SetMapSeedRecord) => {
      this.chessBoard.setMapSeed(data.seed);
    },
    [ActionType.setMapSize]: (data: SetMapSizeRecord) => {
      this.chessBoard.setMapSize(data.width, data.height);
    },

    [ActionType.setMapChess]: (data: SetMapChessRecord) => {
      this.chessBoard.setMapChess(data.chessList);
    },

    [ActionType.readMap]: (data: SetMapNameRecord) => {
      this.chessBoard.readMap(data.mapName);
    },

    [ActionType.addChess]: (data: AddChessRecord) => {
      let ch: Chess = this.chessBoard.createChess(data.chessType);
      ch.color = data.chessColor;
      ch.position = data.position;
      this.chessBoard.addChess(ch);
    },
    [ActionType.removeChess]: (data: RemoveChessRecord) => {
      this.chessBoard.removeChess(
        this.chessBoard.getChessByPosition(data.position)
      );
    },
    [ActionType.chooseChess]: (data: ChooseChessRecord) => {
      let ch = this.chessBoard.getChessByPosition(data.position);
      this.chessBoard.chooseChess(ch);
    },
    [ActionType.moveChess]: (data: MoveChessRecord) => {
      this.chessBoard.moveChess(data.position);
    },
    [ActionType.chooseSkill]: (data: ChooseSkillRecord) => {
      this.chessBoard.chooseSkill(data.skillType);
    },
    [ActionType.castSkill]: (data: CastSkillRecord) => {
      this.chessBoard.castSkill(data.position);
    },
    [ActionType.rest]: () => {
      this.chessBoard.rest();
    }
  };
}
