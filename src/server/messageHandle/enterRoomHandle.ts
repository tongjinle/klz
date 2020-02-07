import { Socket } from "socket.io";
import lobby from "../lobby";
import MessageType from "../messageType";
import {
  EnterRoomNotify,
  EnterRoomRequest,
  EnterRoomResponse
} from "../protocol";
import actionFactory from "./factory/actionFactory";
import {
  checkRoom,
  checkRoomNotFull,
  checkUserNotInRoom
} from "./factory/checkFactory";
import checkLoop from "./factory/checkFactory";
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

  // can
  // 1.存在房间
  // 2.房间未满
  // 3.本人未在任何房间
  let can = checkLoop(socket, data, [
    checkRoom,
    checkRoomNotFull,
    checkUserNotInRoom
  ]);
  if (can.code) {
    send(MessageType.enterRoomResponse, can);
    return;
  }

  // action
  let room = lobby.findRoom(roomId);
  lobby.enterRoom(userId, roomId);
  resData = { code: 0, info: lobby.getRoomInfo(room) };
  notiData = { info: lobby.getRoomInfo(room) };

  // message
  send(MessageType.enterRoomResponse, resData);
  notifyInRoom(roomId, MessageType.enterRoomNotify, notiData);
}
