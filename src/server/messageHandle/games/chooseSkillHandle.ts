import { Socket } from "socket.io";
import Game from "../../../logic/Game";
import MessageType from "../../messageType";
import { ChooseSkillRequest, ChooseSkillResponse } from "../../protocol";
import Room from "../../room";
import User from "../../user";
import actionFactory from "../factory/actionFactory";

function handle(
  socket: Socket,
  data: ChooseSkillRequest,
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

  let { skillType } = data;

  let resData: ChooseSkillResponse;

  if (!game.chessBoard.canChooseSkill(skillType)) {
    resData = { code: -1, message: "选择技能失败" };
    send(MessageType.chooseSkillResponse, resData);
    return;
  }

  game.chessBoard.chooseSkill(skillType);
  resData = { code: 0 };
  send(MessageType.chooseSkillResponse, resData);
}

export default handle;
