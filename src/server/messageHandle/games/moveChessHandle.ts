import { Socket } from "socket.io";
import Game from "../../../logic/Game";
import MessageType from "../../messageType";
import {
  MoveChessNotify,
  MoveChessRequest,
  MoveChessResponse
} from "../../protocol";
import Room from "../../room";
import User from "../../user";
import actionFactory from "../factory/actionFactory";

function handle(
  socket: Socket,
  data: MoveChessRequest,
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

  let resData: MoveChessResponse = {
    code: 0
  };

  if (!game.chessBoard.canMoveChess({ x, y })) {
    resData = { code: -1, message: "棋子移动失败" };
    send(MessageType.moveChessResponse, resData);
    return;
  }

  let chess = game.chessBoard.currentChess;
  game.chessBoard.moveChess({ x, y });

  resData = { code: 0 };
  send(MessageType.moveChessResponse, resData);

  let notiData: MoveChessNotify = {
    userId: user.id,
    chessId: chess.id,
    position: { x, y }
  };
  notifyInRoom(room.id, MessageType.moveChessNotify, notiData);
}

export default handle;
