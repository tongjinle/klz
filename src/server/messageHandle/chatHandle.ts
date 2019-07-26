import MessageType from "../messageType";
import { ChatRequest, ChatResponse, ChatNotify } from "../protocol";
import actionFactory from "./factory/actionFactory";
import { Socket } from "socket.io";

/**
 * 聊天
 * @param  {Socket} socket
 * @param  {ChatRequest} data
 */
function handle(socket: Socket, data: ChatRequest) {
  let { send, notify } = actionFactory(socket);

  let resData: ChatResponse = { code: 0 };
  send(MessageType.chatResponse, resData);

  let resNotify: ChatNotify = data;
  notify(MessageType.chatNotify, resNotify);
}

export default handle;
