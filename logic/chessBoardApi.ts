import { IPosition } from "./types";
import ChessBoard from "./chessBoard/chessBoard";
import Chess from "./chess/chess";

// 位置相关
// 是否在棋盘中
export function isInChessBoard(chBoard: ChessBoard, posi: IPosition): boolean {
  let rst: boolean = true;
  rst =
    rst &&
    (posi.x >= 0 &&
      posi.x < chBoard.width &&
      posi.y >= 0 &&
      posi.y < chBoard.height);
  return rst;
}

export function getChessByPosi(chBoard: ChessBoard, posi: IPosition): Chess {
  let ch: Chess;
  return ch;
}

export function addChess(chBoard: ChessBoard, ch: Chess): void {
  chBoard.chessList.push(ch);
}
