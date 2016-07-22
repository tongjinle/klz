/// <reference path="../typings/index.d.ts" />

import * as chessBoardApi from './chessBoardApi';

import skillList from './skill/skillList';

export function createSkill(skt: SkillType) {
	let sk: ISkill = new skillList[skt]();

	sk.id = parseInt(_.uniqueId());
}

export function setOwner(sk: ISkill, ch: IChess) {
	sk.owner = ch;
}

// 效果列表
let effectList: { [skillType: number]: IEffect } = {};
effectList[SkillType.attack] = (sk, chBoard, posi) => {
	let ch = chessBoardApi.getChessByPosi(chBoard, posi);
	let damage = 1;
	setHp(ch, ch.hp - damage);
};

export function castSkill(sk: ISkill, chBoard: IChessBoard, posi: IPosition) {
	effectList[sk.type](sk,chBoard,posi);
	setCd(sk,sk.maxcd);
}


export function setHp(ch: IChess, hp: number): void {

}

export function setCd(sk:ISkill,cd:number):void{
	sk.cd = cd;
}