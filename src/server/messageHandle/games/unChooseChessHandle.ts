import { Socket } from "socket.io";
import Game from "../../../logic/Game";
import MessageType from "../../messageType";
import {
  UnChooseChessNotify,
  UnChooseChessRequest,
  UnChooseChessResponse
} from "../../protocol";
import Room from "../../room";
import User from "../../user";
import actionFactory from "../factory/actionFactory";

function handle(
  socket: Socket,
  data: UnChooseChessRequest,
  {
    user,
    room,
    game
  }: {
    user: User;
    room: Room;
    game: Game;
  }
) {
  let { send, notifyInRoom } = actionFactory(socket);

  let resData: UnChooseChessResponse = {
    code: 0
  };

  if (!game.chessBoard.canUnchooseChess()) {
    resData = { code: -1, message: "无法选择该棋子" };
    send(MessageType.chooseChessResponse, resData);
    return;
  }
  game.chessBoard.unChooseChess();

  send(MessageType.chooseChessResponse, resData);

  // notify
  let notiData: UnChooseChessNotify = {};
  notifyInRoom(room.id, MessageType.chooseChessNotify, notiData);
}

export default handle;
