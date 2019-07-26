import { Socket } from "socket.io";
import lobby from "../lobby";
import MessageType from "../messageType";
import { LobbyRequest, LobbyResponse } from "../protocol";
import actionFactory from "./factory/actionFactory";

/**
 * 大厅信息
 * @param  {Socket} socket
 * @param  {LobbyRequest} data
 */
function handle(socket: Socket, data: LobbyRequest) {
  let { send } = actionFactory(socket);

  // 查询房间列表
  let resData: LobbyResponse = { code: 0, list: lobby.getLobbyInfo() };
  send(MessageType.lobbyResponse, resData);
}

export default handle;
