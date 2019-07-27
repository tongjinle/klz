import { Socket } from "socket.io";
import lobby from "../lobby";
import MessageType from "../messageType";
import {
  EnterRoomNotify,
  EnterRoomRequest,
  EnterRoomResponse,
  LeaveRoomRequest,
  LeaveRoomResponse,
  LeaveRoomNotify
} from "../protocol";
import actionFactory from "./factory/actionFactory";
import helpFactory from "./factory/helpFactory";
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
export default function handle(socket: Socket, data: LeaveRoomRequest) {
  let { getUser, getRoom } = helpFactory(socket);
  let { send, notifyInRoom } = actionFactory(socket);

  let resData: LeaveRoomResponse;
  let notiData: LeaveRoomNotify;

  let userId = socket.id;
  let user = lobby.findUser(userId);

  // can
  // .本人在房间
  // .房间的状态为'未准备'
  let can = checkLoop(socket, data, [
    (socket, data) => {
      if (!user.roomId) {
        return { code: -1, message: "用户不在房间中" };
      }
      return { code: 0 };
    }
  ]);
  if (can.code) {
    send(MessageType.enterRoomResponse, can);
    return;
  }

  // action
  let roomId = user.roomId;
  lobby.enterRoom(userId, roomId);
  let room = lobby.findRoom(roomId);
  resData = { code: 0, info: lobby.getRoomInfo(room) };
  notiData = { info: lobby.getRoomInfo(room) };

  // message
  send(MessageType.enterRoomResponse, resData);
  notifyInRoom(roomId, MessageType.enterRoomNotify, notiData);
}
