import { Socket } from "socket.io";
import Game from "../../../logic/Game";
import MessageType from "../../messageType";
import { RangeRequest, RangeResponse } from "../../protocol";
import Room from "../../room";
import User from "../../user";
import actionFactory from "../factory/actionFactory";

function handle(
  socket: Socket,
  data: RangeRequest,
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

  let resData: RangeResponse;

  if (!game.chessBoard.currentChess) {
    resData = { code: -1, message: "没有当前棋子", positionList: [] };
    send(MessageType.rangeResponse, resData);
    return;
  }

  let chess = game.chessBoard.currentChess;

  resData = { code: 0, positionList: chess.getMoveRange() };
  send(MessageType.rangeResponse, resData);
}

export default handle;
