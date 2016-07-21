/// <reference path="../../typings/index.d.ts" />

import * as api from '../api.ts';
import {Chess} from './chess';

export class Cavalry extends Chess {
	constructor() {
		super();

		this.getMoveRange = () => [
			{ x: this.posi.x - 2, y: this.posi.y + 1 },
			{ x: this.posi.x - 2, y: this.posi.y - 1 },
			{ x: this.posi.x + 2, y: this.posi.y + 1 },
			{ x: this.posi.x + 2, y: this.posi.y - 1 },
			{ x: this.posi.x + 1, y: this.posi.y - 2 },
			{ x: this.posi.x - 1, y: this.posi.y - 2 },
			{ x: this.posi.x + 1, y: this.posi.y + 2 },
			{ x: this.posi.x - 1, y: this.posi.y + 2 },
		];
	}



}