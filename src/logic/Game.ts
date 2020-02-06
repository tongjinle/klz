import ChessBoard from "./chessBoard/chessBoard";
import { IRecord } from "./types";
import { genUniqueId } from "./api";

/** 游戏实体类 */
class Game {
  /**id */
  id: string;
  /**棋盘 */
  chessBoard: ChessBoard;
  /**必要游戏人数 */
  requiredPlayer: number;

  constructor() {
    this.id = genUniqueId();
    this.chessBoard = new ChessBoard();
  }
}

export default Game;
