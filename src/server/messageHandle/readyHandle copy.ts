import { Socket } from "socket.io";
import lobby from "../lobby";
import MessageType from "../messageType";
import { LobbyRequest, LobbyResponse } from "../protocol";
import actionFactory from "./factory/actionFactory";

function handle(socket: Socket, data: LobbyRequest) {
  let { send, notifyInRoom } = actionFactory(socket);
}

export default handle;
