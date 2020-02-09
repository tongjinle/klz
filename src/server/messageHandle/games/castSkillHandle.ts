import { Socket } from "socket.io";
import Game from "../../../logic/Game";
import MessageType from "../../messageType";
import {
  CastSkillRequest,
  CastSkillResponse,
  CastSkillNotify
} from "../../protocol";
import Room from "../../room";
import User from "../../user";
import actionFactory from "../factory/actionFactory";
import ChangeTable from "../../../logic/changeTable";

function handle(
  socket: Socket,
  data: CastSkillRequest,
  {
    user,
    room,
    game
  }: {
    user: User;
    room: Room;
    game: Game;
  }
) {
  let { send, notifyInRoom, notifyAllInRoom } = actionFactory(socket);

  let { position } = data;

  let resData: CastSkillResponse;

  if (!game.chessBoard.canCastSKill(position)) {
    resData = { code: -1, message: "选择技能目标失败" };
    send(MessageType.castSkillResponse, resData);
    return;
  }

  game.chessBoard.castSkill(position);
  resData = { code: 0 };
  send(MessageType.castSkillResponse, resData);

  let recordList = game.chessBoard.changeTable.recordList;
  let notiData: CastSkillNotify = {
    code: 0,
    change: recordList[recordList.length - 1]
  };
  console.log(notiData);
  notifyAllInRoom(room.id, MessageType.castSkillNotify, notiData);
}

export default handle;
