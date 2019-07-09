import { Socket } from "socket.io";

enum MessageType {
  chat = "chat"
}

function handle(socket: Socket, type: MessageType, data: any) {
  if (type === MessageType.chat) {
    socket.broadcast.emit("message", { type, data });
  }
}

export default handle;
