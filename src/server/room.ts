import { RoomStatus } from "./types";
import Rule from "./rule";

export default class Room {
  /**房间id */
  id: string;
  /**房间名字 */
  name: string;
  status: RoomStatus;
  /**玩家id列表 */
  userIdList: string[];
  /**游戏id */
  gameId: string;
  /**房间的游戏规则 */
  rule: Rule;
}
