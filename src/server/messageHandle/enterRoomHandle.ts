import { Socket } from "socket.io";
import lobby from "../lobby";
import MessageType from "../messageType";
import {
  EnterRoomNotify,
  EnterRoomRequest,
  EnterRoomResponse
} from "../protocol";
import actionFactory from "./factory/actionFactory";
/**
 * @param  {Socket} socket
 * @param  {EnterRoomRequest} data
 */
export default function handle(socket: Socket, data: EnterRoomRequest) {
  let { send, notifyInRoom } = actionFactory(socket);

  let resData: EnterRoomResponse;
  let notiData: EnterRoomNotify;
  let roomId = data.roomId;
  let userId = socket.id;

  let can = lobby.canEnterRoom(userId, roomId);
  if (can.code === 0) {
    lobby.enterRoom(userId, roomId);

    let room = lobby.findRoom(roomId);
    resData = { code: 0, info: lobby.getRoomInfo(room) };
    notiData = { info: lobby.getRoomInfo(room) };

    // message
    send(MessageType.enterRoomResponse, resData);
    notifyInRoom(roomId, MessageType.enterRoomNotify, notiData);
  } else {
    send(MessageType.enterRoomResponse, can);
  }
}
