/// <reference path="../../typings/index.d.ts" />

import * as api from '../api';
import {Chess} from './chess';

export class Footman extends Chess {
	constructor() {
		super();

		// 获得可以移动的坐标列表
		// 这个列表是棋子"期望"的,但是不表示棋子就有这个权限可以移动到那
		this.getMoveRange = () => api.rangeApi.nearRange(this.posi, 1);
	}



}

