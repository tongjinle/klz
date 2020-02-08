import { Socket } from "socket.io";
import lobby from "../lobby";
import MessageType from "../messageType";
import {
  LobbyRequest,
  LobbyResponse,
  ReadyRequest,
  ReadyResponse,
  ReadyNotify
} from "../protocol";
import actionFactory from "./factory/actionFactory";

function handle(socket: Socket, data: ReadyRequest) {
  let { send, notifyInRoom } = actionFactory(socket);
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
  } else {
    send(MessageType.readyResponse, { code: -1, message: "用户ready失败" });
  }
}

export default handle;
