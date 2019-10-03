function serPartnerInput(name){

	if(name==''){
		$('#set-partner-target').val('');
		$('#set-partner-partner').val('');
		$('#set-team-team').val('');
	}else{
		var v1=$('#set-partner-target').val();
		var v2=$('#set-partner-partner').val();
		if(v1==''){
			$('#set-partner-target').val(name);
		}else{
			$('#set-partner-partner').val(name);
		}
	}
}

function serTeamInput(team){
	$('#set-team-team').val(team);
}

function serScoreInput(score){
	$('#set-score').val(score);	
}

function setTeam(){
	var v1=$('#set-partner-target').val();
	var team=$('#set-team-team').val();
	$('#set-partner-target').val('');
	$('#set-team-team').val('');
	socket.emit('set-team',v1,team);
}

function setPartner(){
	var v1=$('#set-partner-target').val();
	var v2=$('#set-partner-partner').val();
	$('#set-partner-target').val('');
	$('#set-partner-partner').val('');	
	socket.emit('set-partner',v1,v2);
}

function addScore(){
	var v1=$('#set-partner-target').val();
	var v2=$('#set-partner-partner').val();
	var team=$('#set-team-team').val();
	var score=$('#set-score').val();
	$('#set-partner-target').val('');
	$('#set-partner-partner').val('');	
	$('#set-team-team').val('');
	$('#set-score').val('');	
	socket.emit('add-score',v1,v2,team,score);
}

function setScore(){
	var v1=$('#set-partner-target').val();
	var score=$('#set-score').val();
	$('#set-partner-target').val('');
	$('#set-score').val('');	
	socket.emit('set-score',v1,score);

}


function getUserlist(){
	socket.emit('get-userlist');
	socket.on('get-userlist',(userList)=>{
		var list="";
		var len=userList.length;
		for(var i=0;i<len;i++){
			list=list+userList[i].name+"/"+userList[i].partner+"/"+userList[i].team+"/"+userList[i].score+"<br>";
		}
		$('#userlist-info').html(list);
	});
}


