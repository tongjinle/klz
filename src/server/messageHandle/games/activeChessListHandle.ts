import { Socket } from "socket.io";
import Game from "../../../logic/Game";
import MessageType from "../../messageType";
import {
  ActiveChessListRequest,
  ActiveChessListResponse
} from "../../protocol";
import Room from "../../room";
import User from "../../user";
import actionFactory from "../factory/actionFactory";

function handle(
  socket: Socket,
  data: ActiveChessListRequest,
  { game }: { user: User; room: Room; game: Game }
) {
  let { send } = actionFactory(socket);
  let resData: ActiveChessListResponse = {
    code: 0,
    chessIdList: game.chessBoard.chessList.map(n => n.id)
  };

  send(MessageType.activeChessListResponse, resData);
}

export default handle;
