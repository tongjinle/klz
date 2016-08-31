/// <reference path="../typings/index.d.ts" />


import * as _ from 'underscore';
import {IChange, ChangeType} from './types';

export default class ChangeTable {
	recoList: IChange<{}>[];

	constructor() {
		this.recoList = [];
	}

	private queryRecoList: IChange<{}>[];
	queryByRound(round: number): ChangeTable {
		this.queryRecoList = this.queryRecoList || this.recoList;
		this.queryRecoList = _(this.queryRecoList).filter(reco => reco.round == round);
		return this;
	}

	queryByChangeType(cht: ChangeType): ChangeTable {
		this.queryRecoList = this.queryRecoList || this.recoList;
		this.queryRecoList = _(this.queryRecoList).filter(reco => reco.type == cht);
		return this;
	}

	queryByParams<T>(filter: (reco: IChange<T>) => boolean):ChangeTable {
		this.queryRecoList = this.queryRecoList || this.recoList;
		this.queryRecoList = _(this.queryRecoList).filter(filter);
		return this;
	}



	toList(): IChange<{}>[] {
		let rst = this.queryRecoList;
		this.queryRecoList = undefined;
		return rst;
	}

}

