import * as rangeApi from "./rangeApi";
import * as chessApi from "./chessApi";
import * as skillApi from "./skillApi";
import * as chessBoardApi from "./chessBoardApi";

const genUniqueId = () => {
  return Math.random()
    .toString()
    .slice(2);
};

export { rangeApi, chessApi, skillApi, chessBoardApi, genUniqueId };
