/// <reference path="../../typings/index.d.ts" />

import _ = require("underscore");
import * as api from '../api';
import {Chess} from './chess';

export class Footman extends Chess {
	constructor() {
		super();

		// 技能列表
		let skill: ISkill;
		this.skillList.push(api.skillApi.create(SkillType.attack));

		// 生命值
		this.hp = 5;

		// 获得可以移动的坐标列表
		this.getMoveRangeOnPurpose = () => api.rangeApi.nearRange(this.posi, 1);

	}



}

