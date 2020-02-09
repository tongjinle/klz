import { Socket } from "socket.io";
import Game from "../../../logic/Game";
import MessageType from "../../messageType";
import {
  ChooseChessNotify,
  ChooseChessRequest,
  ChooseChessResponse
} from "../../protocol";
import Room from "../../room";
import User from "../../user";
import actionFactory from "../factory/actionFactory";

function handle(
  socket: Socket,
  data: ChooseChessRequest,
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

  let { x, y } = data.position;

  let resData: ChooseChessResponse = {
    code: 0
  };
  let chess = game.chessBoard.chessList.find(
    ch => ch.position.x === x && ch.position.y === y
  );

  if (!chess) {
    resData = {
      code: -1,
      message: "该位置上没有棋子"
    };
    send(MessageType.chooseChessResponse, resData);
    return;
  }

  if (!game.chessBoard.canChooseChess(chess)) {
    resData = { code: -2, message: "无法选择该棋子" };
    send(MessageType.chooseChessResponse, resData);
  }
  game.chessBoard.chooseChess(chess);

  send(MessageType.chooseChessResponse, resData);

  // notify
  let notiData: ChooseChessNotify = { userId: user.id, position: { x, y } };
  notifyInRoom(room.id, MessageType.chooseChessNotify, notiData);
}

export default handle;
