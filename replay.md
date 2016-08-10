# database

## replay table 
fields:
	action:string,
	data:{}

 - readMap
{
	action:'readMap',
	data:{
		mapName,
		randomSeed
	}
}


- addChess
{
	action:'addChess',
	data:{
		chessType,
		position,
		chessColor
	}
}

- removeChess
{
	action:'removeChess',
	data:{
		position
	}
}

- selectChess
{
	action:'selectChess',
	data:{
		position
	}	
}

- moveChess
{
	action:'moveChess',
	data:{
		position
	}
}

- selectSkill
{
	action:'selectSkill',
	data:{
		skillType
	}
}

- castSkill
{
	action:'castSkill',
	data:{
		position
	}
}

- rest
{
	action:'rest',
	data:null
}

## record table

fields
	round:number,
	player:number,
	type:string,
	data:

ignore 'round' , 'player' to describe record format
- chess
{	
	action:'born',
	type:'chess',
	data:{
		chess:{
			id,
			hp,
			energy,
			position,
			type,
			color,
			status
		}
	}

}

{
	action:'die',
	type:'chess',
	data:{
		id:number
	}
	data:null
}


{
	action:'move',
	type:'chess',
	data:{
		position
	}
}

- skill
{
	action:'cast',
	type:'skill',
	data:{
		caster,
		target,
		effect:{
			heal,
			damage
		}
	}
	
}

- rest (active rest)
{
	action:'rest',
	data:null

}

- round
{
	action:'round',
	data:{
		energy
	}
}




