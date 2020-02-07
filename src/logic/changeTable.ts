import { IChange } from "./types";

export default class ChangeTable {
  recordList: IChange[];

  constructor() {
    this.recordList = [];
  }
}
