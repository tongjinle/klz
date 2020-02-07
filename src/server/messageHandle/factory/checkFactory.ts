import lobby from "../../lobby";
import { Socket } from "socket.io";
import { BaseResponse, EnterRoomRequest } from "../../protocol";
import helpFactory from "./helpFactory";

interface ICheck {
  (socket: Socket, data: any): BaseResponse;
}

/**
 * 检查room是否存在
 * 存在,code为0
 * @param socket
 * @param data
 */
export function checkRoom(
  socket: Socket,
  data: EnterRoomRequest
): BaseResponse {
  let room = lobby.findRoom(data.roomId);
  if (!room) {
    return { code: -1, message: "不存在该房间" };
  }

  return { code: 0 };
}

export function checkRoomNotFull(
  socket: Socket,
  data: EnterRoomRequest
): BaseResponse {
  let room = lobby.findRoom(data.roomId);
  // if (room.status !== RoomStatus.notFull) {
  //   return { code: -2, message: "房间已经满人" };
  // }

  return { code: 0 };
}

export function checkUserNotInRoom(socket: Socket, data: any): BaseResponse {
  let user = lobby.findUser(socket.id);
  if (!!user.roomId) {
    return { code: -3, message: "用户已经在房间中" };
  }

  return { code: 0 };
}

function checkLoop(socket: Socket, data: any, checks: ICheck[]) {
  let can = checks.find(ck => ck(socket, data).code !== 0);
  if (!can) {
    return { code: 0 };
  }
}

export default checkLoop;
