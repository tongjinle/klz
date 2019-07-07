import ChessBoard from "./chessBoard/chessBoard";
import { IRecord } from "./types";

class Game {
  // 属性
  // ***************************************************

  // 棋盘
  chBoard: ChessBoard;
  // 记录
  recoList: IRecord[];
}

export default Game;
