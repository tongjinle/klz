import { UserStatus } from "./types";

// 用户实体类
class User {
  /**用户id,即socket.id */
  id: string;
  /**房间id */
  roomId: string;
  /**游戏id */
  gameId: string;
  /**用户状态 */
  status: UserStatus;
}

export default User;
