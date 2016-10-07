import {IPlayerInfo, IPlayer, ChessColor, PlayerStatus, ChessStatus} from '../types';
import * as _ from 'underscore';


export default class Player implements IPlayer {
	name: string;
	color: ChessColor;
	status: PlayerStatus;
	chStatus: ChessStatus;
	energy: number;

	toString(): IPlayerInfo {
		let info: IPlayerInfo = {} as IPlayerInfo;
		info.name = this.name;
		info.color = this.color;
		info.status = this.status;
		info.chStatus = this.chStatus;
		info.energy = this.energy;
		return info;
	}

	static parse(info: IPlayerInfo): IPlayer {
		let p: IPlayer = new Player();
		p.name = info.name;
		p.color = info.color;
		p.status = info.status;
		p.chStatus = info.chStatus;
		p.energy = info.energy;
		return p;
	}
}