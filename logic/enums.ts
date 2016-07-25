
export enum ChessColor {
	red,
	black
}

export enum ChessType {
	footman,
	cavalry,
	minister,
	magic,
	king
}

// move之后可以cast
// cast之后,就rest
export enum ChessStatus {
	beforeMove,
	beforeCast,
	rest
}

export enum PlayerStatus{
	waiting,
	thinking,
	// done是整局下完
	done
}


export enum SkillType {
	attack,
	heal
}


export enum RecordType {
	round,
	move,
	cast,
	rest
}

export enum AskType{
	selectChess,
	unSelectChess,
	selectPosition,
	confirmPosition,
	selectSkill,
	unSelectSkill,
	rest,
	giveup

}