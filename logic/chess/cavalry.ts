/// <reference path="../../typings/index.d.ts" />

import * as api from '../api';
import Chess from './chess';

export default class Cavalry extends Chess {
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