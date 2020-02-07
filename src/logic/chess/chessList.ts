import { ChessType } from "../types";
import Cavalry from "./cavalry";
import Footman from "./footman";
import King from "./king";
import Knight from "./knight";
import Magic from "./magic";
import Minister from "./minister";

// 棋子列表
let chessList = {
  ["footman"]: Footman,
  ["cavalry"]: Cavalry,
  ["king"]: King,
  ["knight"]: Knight,
  ["magic"]: Magic,
  ["minister"]: Minister
};

export default chessList;
