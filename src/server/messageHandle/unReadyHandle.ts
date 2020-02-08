import { Socket } from "socket.io";
import lobby from "../lobby";
import MessageType from "../messageType";
import {
  LobbyRequest,
  LobbyResponse,
  UnReadyRequest,
  UnReadyResponse,
  UnReadyNotify
} from "../protocol";
import actionFactory from "./factory/actionFactory";

function handle(socket: Socket, data: UnReadyRequest) {
  let { send, notifyInRoom } = actionFactory(socket);
  let userId = socket.id;

  let can = lobby.canUserUnReady(userId);
  if (can.code === 0) {
    let user = lobby.findUser(userId);
    let roomId = user.roomId;

    lobby.userUnReady(userId);
    let resData: UnReadyResponse = { code: 0 };
    send(MessageType.unReadyResponse, resData);

    notifyInRoom(roomId, MessageType.unReadyNotify, { userId });
  } else {
    send(MessageType.unReadyResponse, {
      code: -1,
      message: "用户取消准备失败"
    });
  }
}

export default handle;
