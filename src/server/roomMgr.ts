import { RoomListResponse } from "./protocol";
import Room from "./room";

const ROOM_COUNT = 10;
class RoomMgr {
  private list: Room[] = [];

  constructor() {
    this.create();
  }

  private create(): void {
    for (let i = 0; i < ROOM_COUNT; i++) {
      let name = `${i}号房间`;
      let room = new Room(name);
      this.list.push(room);
    }
  }

  find(id: string): Room {
    return undefined;
  }

  toString(): RoomListResponse[] {
    return [];
  }
}
let mgr = new RoomMgr();
export default mgr;
