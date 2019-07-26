import lobby from "../../lobby";
import { Socket } from "socket.io";

function helpFactory(socket: Socket) {
  const help = {
    getUser: () => lobby.findUser(socket.id),
    getRoom: () => {
      let user = help.getUser();
      if (user) {
        return lobby.findRoom(user.roomId);
      }
    },
    getGame: () => {
      let room = help.getRoom();
      if (room) {
        return lobby.findGame(room.gameId);
      }
    },
    getChessBoard: () => {
      let game = help.getGame();
      if (game) {
        return game.chessBoard;
      }
    }
  };
  return help;
}

export default helpFactory;
