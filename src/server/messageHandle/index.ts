import { Socket } from "socket.io";
import MessageType from "../messageType";
import chatHandle from "./chatHandle";
import enterRoomHandle from "./enterRoomHandle";
import leaveRoomHandle from "./leaveRoomHandle";
import lobbyHandle from "./lobbyHandle";
import readyHandle from "./readyHandle";
import unReadyHandle from "./unReadyHandle";

interface IHandle {
  (socket: Socket, data: any): void;
}
let list: { type: MessageType; handle: IHandle }[] = [];

list.push({ type: MessageType.chatRequest, handle: chatHandle });
list.push({ type: MessageType.lobbyRequest, handle: lobbyHandle });
list.push({ type: MessageType.enterRoomRequest, handle: enterRoomHandle });
list.push({ type: MessageType.leaveRoomRequest, handle: leaveRoomHandle });
list.push({ type: MessageType.readyRequest, handle: readyHandle });
list.push({ type: MessageType.unReadyRequest, handle: unReadyHandle });

function handle(socket: Socket, type: MessageType, data: any) {
  let item = list.find(n => n.type === type);
  if (item) {
    let handle = item.handle;
    handle(socket, data);
  }
}

export default handle;
