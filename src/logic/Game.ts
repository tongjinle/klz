import ChessBoard from "./chessBoard/chessBoard";
import { IRecord } from "./types";
import { genUniqueId } from "./api";

class Game {
  // id
  id: string;
  // 棋盘
  chBoard: ChessBoard;

  constructor() {
    this.id = genUniqueId();
    this.chBoard = new ChessBoard();
  }
}

export default Game;
