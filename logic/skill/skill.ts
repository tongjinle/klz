class Skill implements ISkill {
	id:number;
	type:SkillType;
	owner:IChess;
	getCastRange: () => IPosition[];
	effect: (posiTarget: IPosition) => void;
	maxcd: number;
	cd: number;
	cooldown: () => void;

	constructor(){

	}
}