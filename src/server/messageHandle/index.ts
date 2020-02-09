import { Socket } from "socket.io";
import MessageType from "../messageType";
import chatHandle from "./chatHandle";
import enterRoomHandle from "./enterRoomHandle";
import leaveRoomHandle from "./leaveRoomHandle";
import lobbyHandle from "./lobbyHandle";
import readyHandle from "./readyHandle";
import unReadyHandle from "./unReadyHandle";
import activeChessListHandle from "./games/activeChessListHandle";
import chooseChessHandle from "./games/chooseChessHandle";
import unChooseChessHandle from "./games/unChooseChessHandle";
import moveChessHandle from "./games/moveChessHandle";
import rangeHandle from "./games/rangeHandle";
import activeSkillListHandle from "./games/activeSkillListHandle";
import chooseSkillHandle from "./games/chooseSkillHandle";
import castSkillHandle from "./games/castSkillHandle";
import Game from "../../logic/Game";
import lobby from "../lobby";
import User from "../user";
import Room from "../room";

interface IHandle {
  (
    socket: Socket,
    data: any,
    info: {
      user: User;
      room: Room;
      game: Game;
    }
  ): void;
}
let list: { type: MessageType; handle: IHandle; game?: Game }[] = [];

list.push({ type: MessageType.chatRequest, handle: chatHandle });
list.push({ type: MessageType.lobbyRequest, handle: lobbyHandle });
list.push({ type: MessageType.enterRoomRequest, handle: enterRoomHandle });
list.push({ type: MessageType.leaveRoomRequest, handle: leaveRoomHandle });
list.push({ type: MessageType.readyRequest, handle: readyHandle });
list.push({ type: MessageType.unReadyRequest, handle: unReadyHandle });
// game handle
list.push({
  type: MessageType.activeChessListRequest,
  handle: activeChessListHandle
});
list.push({
  type: MessageType.chooseChessRequest,
  handle: chooseChessHandle
});
list.push({
  type: MessageType.unChooseChessRequest,
  handle: unChooseChessHandle
});
list.push({
  type: MessageType.moveChessRequest,
  handle: moveChessHandle
});
list.push({ type: MessageType.rangeRequest, handle: rangeHandle });
list.push({
  type: MessageType.activeSkillListRequest,
  handle: activeSkillListHandle
});
list.push({ type: MessageType.chooseSkillRequest, handle: chooseSkillHandle });
list.push({ type: MessageType.castSkillRequest, handle: castSkillHandle });

function handle(socket: Socket, type: MessageType, payload: any) {
  let item = list.find(n => n.type === type);
  if (item) {
    let handle = item.handle;
    let user: User, room: Room, game: Game;
    user = lobby.findUser(socket.id);
    if (user) {
      if (user.roomId) {
        room = lobby.findRoom(user.roomId);
      }
      if (user.gameId) {
        game = lobby.findGame(user.gameId);
      }
    }
    handle(socket, payload, { user, room, game });
  }
}

export default handle;
