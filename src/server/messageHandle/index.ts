import chatHandle from "./chatHandle";
import lobbyHandle from "./lobbyHandle";
import enterRoomHandle from "./enterRoomHandle";
import { Socket } from "socket.io";
import MessageType from "../messageType";

interface IHandle {
  (socket: Socket, data: any): void;
}
let list: { type: MessageType; handle: IHandle }[] = [];

list.push({ type: MessageType.chatRequest, handle: chatHandle });
list.push({ type: MessageType.lobbyRequest, handle: lobbyHandle });
list.push({ type: MessageType.enterRoomRequest, handle: enterRoomHandle });

function handle(socket: Socket, type: MessageType, data: any) {
  let item = list.find(n => n.type === type);
  if (item) {
    let handle = item.handle;
    handle(socket, data);
  }
}

export default handle;
