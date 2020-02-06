import Lobby from "./lobby";

type CheckResponse = {
  flag: boolean;
  message?: string;
};

/**通过检测的常量 */
const RIGHT: CheckResponse = {
  flag: true
};

/**
 * 检测大厅是否存在
 * @param lobby 大厅
 */
export function isLobbyExists(lobby: Lobby): CheckResponse {
  return !!lobby ? RIGHT : { flag: false, message: "大厅不存在" };
}

/**
 * 检测用户是否存在
 * @param lobby 大厅
 * @param userId 用户id
 */
export function isUserExists(lobby: Lobby, userId: string): CheckResponse {
  return !!lobby.userList.find(n => n.id === userId)
    ? RIGHT
    : { flag: false, message: "用户不存在" };
}

export function isRoomExists(lobby: Lobby, roomId: string): CheckResponse {
  return !!lobby.roomList.find(n => n.id === roomId)
    ? RIGHT
    : {
        flag: false,
        message: "房间不存在"
      };
}
