import { Socket } from "socket.io";
import Game from "../../../logic/Game";
import MessageType from "../../messageType";
import {
  ActiveSkillListRequest,
  ActiveSkillListResponse
} from "../../protocol";
import Room from "../../room";
import User from "../../user";
import actionFactory from "../factory/actionFactory";

function handle(
  socket: Socket,
  data: ActiveSkillListRequest,
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
  let { send, notifyInRoom } = actionFactory(socket);

  let resData: ActiveSkillListResponse;

  let chess = game.chessBoard.currentChess;

  if (!chess) {
    resData = { code: -1, message: "没有当前棋子", skillTypeList: [] };
    send(MessageType.activeSkillListResponse, resData);
  }

  resData = {
    code: 0,
    skillTypeList: chess.activeSkillList.map(sk => sk.type)
  };

  send(MessageType.activeSkillListResponse, resData);
}

export default handle;
