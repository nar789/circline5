function Buzzer(){
	this.name="";
	this.lock=0;
}
var buzzer=new Buzzer();

function User(id, name, score, color) {
	this.id = id;
	this.socketId = 0;
	this.name = name;
	this.score = score;
	this.color = color;
	this.partner = "";
	this.team = "";
}
function UserList(userList) {
	this.userList = userList;
	this.length = userList.length;
	this.containsByNmae = (name) => {
		var len = this.userList.length;
		for (var i = 0; i < len; i++) {
			if (name == this.userList[i].name) {
				return true;
			}
		}
		return false;
	};
	this.getIdByName = (name) => {
		var len = this.userList.length;
		for (var i = 0; i < len; i++) {
			if (name == this.userList[i].name) {
				return i;
			}
		}
		return -1;
	}
	this.setSocketIdById = (id, socketId) => {
		userList[id].socketId = socketId;
	};
	this.getColorByName = (name) => {
		var len = this.userList.length;
		for (var i = 0; i < len; i++) {
			if (name == this.userList[i].name) {
				return this.userList[i].color;
			}
		}
		return "gray";
	}
	this.setPartner = (name1, name2) => {
		console.log("setPartner = " + name1 + "/" + name2);
		var name1Id = this.getIdByName(name1);
		var name2Id = this.getIdByName(name2);
		if (name1Id < 0 || name2Id < 0) {
			console.log("not found by name ids = " + name1Id + " / " +
				name2Id);
			return;
		}
		this.userList[name1Id].partner = name2;

		this.userList[name2Id].partner = name1;
	}
	this.setTeam = (name, team) => {
		var id = this.getIdByName(name);
		if (id < 0) {
			console.log("not found by name id = " + id);
			return;
		}
		this.userList[id].team = team;
	}
	this.addScore = (name, partner, team, score) => {
		var score = parseInt(score);
		if (team != "") {
			var len = this.userList.length;
			for (var i = 0; i < len; i++) {
				if (this.userList[i].team == team) {
					this.userList[i].score += score;
				}
			}
			io.emit('alert-add-score-team', team,score);
		} else {
			var id = this.getIdByName(name);
			if (partner != "") {
				var pid = this.getIdByName(partner);
				if (pid < 0) {
					console.log("not found by name id = " + pid);
					return;
				}
				this.userList[pid].score += score;
			} else {
				partner = this.userList[id].partner;
			}
			if (id < 0) {
				console.log("not found by name id = " + id);
				return;
			}
			this.userList[id].score += score;
			io.emit('alert-add-score-partner', name, partner, score);
		}
	}
	this.setScore = (name, score) => {
		var id = this.getIdByName(name);
		var score = parseInt(score);
		if (id < 0) {
			console.log("not found by name id = " + id);
			return;
		}
		this.userList[id].score = score;
	}
	this.getRank = () => {
		var sortedUserList = [];
		var len = this.userList.length;
		for (var i = 0; i < len; i++) {
			if (this.userList[i].name != "이정헌")
				sortedUserList.push(this.userList[i]);
		}
		len = len - 1;
		sortedUserList.sort(function (a, b) {
			return b.score - a.score;
		});
		for (var i = 0; i < len; i++)
			console.log(sortedUserList[i].name);
		return sortedUserList;
	};
}

var nameArr = ["이정헌",
	"전도해",
	"정혜원",
	"장호택",
	"이지원",
	"원도연",
	"오수진",
	"유경민",
	"조재영",
	"전은진",
	"지헌",];
var colorArr = [
	"red", "blue", "#ff0099", "green", "skyblue", "gold", "#00ff00", "pink", "#66ffff", "purple", "#9966ff",
];

var userList = null;

function initUserList() {
	var users = [];
	for (var i = 0; i < 11; i++) {
		users.push(new User(i, nameArr[i], 0, colorArr[i]));
	}
	userList = new UserList(users);
}

function init() {
	initUserList();
	console.log("userList len = " + userList.length);
};
init();


var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');


app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/assets/mp3', express.static(__dirname + '/assets/mp3'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());



app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/splash', function (req, res) {
	res.sendFile(__dirname + '/splash.html');
});

app.get('/login', function (req, res) {
	res.sendFile(__dirname + '/login.html');
});

app.get('/main', function (req, res) {
	var name = req.query.name;
	console.log(name);
	res.render(__dirname + '/main.html', { name: name });
});

app.get('/sound/ok',function(req,res){
	res.sendFile(__dirname + '/assets/mp3/ok.mp3');
});

http.listen(1004, function () {
	console.log('listening on *:1004');
});



io.on('connection', function (socket) {
	console.log('socket connected ID = ' + socket.id);
	var id = -1;
	socket.on('login', function (name) {
		console.log('socket login name = ' + name);
		id = userList.getIdByName(name);
		if (id >= 0) {
			userList.setSocketIdById(id, socket.id);
			socket.emit('login', 'success');
		} else {
			socket.emit('login', 'fail');
		}
	});

	socket.on('message', function (msg) {
		console.log('socket message msg = ' + msg);
		var name = "";
		var nameEndIndex = msg.indexOf('님');
		if (nameEndIndex >= 0)
			name = msg.substr(0, nameEndIndex);
		if (name.length != 0) {
			var color = userList.getColorByName(name);
			io.emit("message", { msg: msg, color: color });
		}
		return;
	});

	socket.on('get-user', function (name) {
		var user = userList.userList[userList.getIdByName(name)];
		socket.emit('get-user', user);
	});

	socket.on('get-userlist', function () {
		socket.emit("get-userlist", userList.userList);
	});

	socket.on('set-partner', function (name1, name2) {
		if (name1 == "" || name2 == "") return;
		userList.setPartner(name1, name2);
	});

	socket.on('set-team', function (name, team) {
		if (name == "" || team == "") return;
		userList.setTeam(name, team);
	});

	socket.on('add-score', function (name, partner, team, score) {
		if (score == "") return;
		userList.addScore(name, partner, team, score);
	});

	socket.on('set-score', function (name, score) {
		if (name == "" || score == "") return;
		userList.setScore(name, score);
	});

	socket.on('get-rank', function () {
		console.log('get-rank()');
		socket.emit('get-rank', userList.getRank());
	});

	socket.on('buzzing',function(name){
		if(buzzer.lock!=1){
			buzzer.lock=1;
			buzzer.name=name;
		}
		io.emit('buzzing','success',buzzer.name);
	});

	socket.on('init-buzzer',function(){
		buzzer.lock=0;
		io.emit('init-buzzer','success');
	});	

	socket.on('open-q',function(qid){
		io.emit('open-q',qid);
	});

	socket.on('close-all-q',function(){
		io.emit('close-all-q');
	});

	socket.on('add-q6-question',function(str){
		io.emit('add-q6-question',str);
	});

	socket.on('disconnect', function () {
		var name = socket.id;
		if (id >= 0) {
			name = userList.userList[id].name;
		}
		console.log('socket disconnected name = ' + name);
	});
});


