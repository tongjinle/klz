import { Socket } from "socket.io";
import lobby from "../lobby";
import MessageType from "../messageType";
import {
  EnterRoomRequest,
  LeaveRoomNotify,
  LeaveRoomRequest,
  LeaveRoomResponse
} from "../protocol";
import actionFactory from "./factory/actionFactory";

/**
 * @param  {Socket} socket
 * @param  {EnterRoomRequest} data
 */
export default function handle(socket: Socket, data: LeaveRoomRequest) {
  let { send, notifyInRoom } = actionFactory(socket);

  let resData: LeaveRoomResponse;
  let notiData: LeaveRoomNotify;

  let userId = socket.id;

  let can = lobby.canLeaveRoom(userId);
  console.log({ can });
  if (can.code === 0) {
    let user = lobby.findUser(userId);
    let roomId = user.roomId;
    let room = lobby.findRoom(roomId);
    lobby.leaveRoom(userId);
    resData = { code: 0 };
    send(MessageType.leaveRoomResponse, resData);
    console.log("...", room.userIdList);

    notiData = { userId };
    notifyInRoom(roomId, MessageType.leaveRoomNotify, notiData);
  } else {
    send(MessageType.leaveRoomResponse, can);
  }
}
