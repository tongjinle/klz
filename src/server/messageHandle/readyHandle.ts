import { Socket } from "socket.io";
import lobby from "../lobby";
import MessageType from "../messageType";
import {
  LobbyRequest,
  LobbyResponse,
  ReadyRequest,
  ReadyResponse,
  ReadyNotify,
  GameStartNotify
} from "../protocol";
import actionFactory from "./factory/actionFactory";

function handle(socket: Socket, data: ReadyRequest) {
  let { send, notifyInRoom, notifyAllInRoom } = actionFactory(socket);
  let userId = socket.id;

  let can = lobby.canUserReady(userId);
  if (can.code === 0) {
    let user = lobby.findUser(userId);
    let roomId = user.roomId;

    lobby.userReady(userId);
    let resData: ReadyResponse = { code: 0 };
    send(MessageType.readyResponse, resData);

    let notiData: ReadyNotify = { userId };
    notifyInRoom(roomId, MessageType.readyNotify, notiData);

    // 查看是不是都准备好了,如果是,则开始游戏了
    {
      let can = lobby.canStartGame(roomId);
      if (can.code === 0) {
        lobby.startGame(roomId);
        let room = lobby.findRoom(roomId);
        let game = lobby.findGame(room.gameId);
        console.log(room.gameId, game);
        let notiData: GameStartNotify = { info: game.chessBoard.toString() };
        notifyAllInRoom(roomId, MessageType.gameStartNotify, notiData);
      }
    }
  } else {
    send(MessageType.readyResponse, { code: -1, message: "用户ready失败" });
  }
}

export default handle;
