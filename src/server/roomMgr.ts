import Room, { RoomStatus } from "./room";

export interface IRoomInfo {
  id: string;
  name: string;
  status: RoomStatus;
  userIdList: string[];
}
class RoomMgr {
  private list: Room[] = [];

  constructor() {
    // 系统生成房间
    const ROOM_COUNT = 10;
    this.create(ROOM_COUNT);
  }

  private create(count: number): void {
    for (let i = 0; i < count; i++) {
      let name = `${i}号房间`;
      let room = new Room(name);
      this.list.push(room);
    }
  }

  find(roomId: string): Room {
    return this.list.find(n => n.id === roomId);
  }

  getLobbyInfo(): IRoomInfo[] {
    return this.list.map(ro => {
      return this.getRoomInfo(ro);
    });
  }

  getRoomInfo(room: Room): IRoomInfo {
    return {
      id: room.id,
      name: room.name,
      status: room.status,
      userIdList: room.userIdList
    };
  }
}
let mgr = new RoomMgr();
export default mgr;
