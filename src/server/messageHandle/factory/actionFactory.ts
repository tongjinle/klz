import { Socket } from "socket.io";
import lobby from "../../lobby";
import MessageType from "../../messageType";

function actionFactory(socket: Socket) {
  // 发送消息
  let send = (type: MessageType, data: any) => socket.send(type, data);
  // 发送通知
  let notify = (type: MessageType, data: any) =>
    socket.broadcast.send(type, data);
  // 发送在房间中的通知(本人不接受消息)
  let notifyInRoom = (roomId: string, type: MessageType, data: any) =>
    socket.to(roomId).broadcast.send(type, data);
  // 发送给房间中所有人(本人也接受到消息)
  let notifyAllInRoom = (roomId: string, type: MessageType, data: any) => {
    let room = lobby.findRoom(roomId);
    // console.log("messageHandle.notifyAllInRoom:", room.userIdList);
    room.userIdList
      .map(userId => lobby.findSocket(userId))
      .forEach(socket => {
        socket.send(type, data);
      });
  };
  return { send, notify, notifyInRoom, notifyAllInRoom };
}

export default actionFactory;
