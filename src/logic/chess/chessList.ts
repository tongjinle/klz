import { ChessType } from "../types";
import Cavalry from "./cavalry";
import Footman from "./footman";
import King from "./king";
import Knight from "./knight";
import Magic from "./magic";
import Minister from "./minister";

// 棋子列表
let chessList = {
  [ChessType.footman]: Footman,
  [ChessType.cavalry]: Cavalry,
  [ChessType.king]: King,
  [ChessType.knight]: Knight,
  [ChessType.magic]: Magic,
  [ChessType.minister]: Minister
};

export default chessList;
