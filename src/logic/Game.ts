import ChessBoard from "./chessBoard/chessBoard";
import { IRecord, Channel } from "./types";
import { genUniqueId } from "./api";

/** 游戏实体类 */
class Game {
  /**id */
  id: string;
  /**棋盘 */
  chessBoard: ChessBoard;
  /**必要游戏人数 */
  requiredPlayer: number;
  /**信息通道 */
  channel: Channel;

  constructor() {
    this.id = genUniqueId();
    this.chessBoard = new ChessBoard();
  }

  setChannel(channel: Channel) {
    if (!this.channel) {
      this.chessBoard.channel = this.channel = channel;
    }
  }
}

export default Game;
