rep# database

## replay table 
fields:
	action:string,
	data:{}

 - addPlayer
 {
 	action:'addPlayer',
 	data:{
 		player,
 		color
 	}
 }
 
 - setMapSeed
 {
 	action:'setMapSeed'
 	data:{
 		seed
 	}
 }

 - setMapSize
 {
 	action:'setMapSize',
 	data:{
 		width,
 		height
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

- chooseChess
{
	action:'chooseChess',
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

- chooseSkill
{
	action:'chooseSkill',
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

- 

## record table

fields
	round:number,
	player:number,
	type:string,
	data:

ignore 'round' , 'player' to describe record format

基本格式:
{
	player,
	round,
	step,
	source:{
		id:
		type:
	},
	target,
	effect:{}
	action:ActionType
	actionParams:{}


}

- chessBoard
{

}

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
		playerName,
		energy
	}
}




