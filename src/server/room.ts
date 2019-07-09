export type RoomStatus = "beforeEnter" | "beforeReady" | "play" | "gameover";

export default class Room {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
