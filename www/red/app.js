
var width = window.innerWidth;
var height = window.innerHeight;

var eventsInterval = 1000;
var randomSimulator = true;

var friendZoneRange = [400, 300, 200];
var meData = { id: 0, x: width/2, y: height/2 };

var currentDate = moment();

var soundBreath = new Howl({
  urls: ['sounds/breath-slow.mp3'],
  sprite: {
    breath: [0, 4000]
  },
  loop: true
});

var soundNotif1 = new Howl({
  urls: ['sounds/notif1.mp3']
});

var soundNotif2 = new Howl({
  urls: ['sounds/notif2.mp3']
});

var soundNotif3 = new Howl({
  urls: ['sounds/notif3.mp3']
});

var data = {};
data.friends = [];
data.relations = [];

var simulatorInterval = false;
var dateInterval = false;

function generateFriendsGrid() {
	var increase = Math.PI * 2 / data.friends.length;
	var angle = 0;
	
	var minMsg = d3.min(data.friends, function(d) { return d.msg_send; });
	var meanMsg = d3.mean(data.friends, function(d) { return d.msg_send; });
	var maxMsg = d3.max(data.friends, function(d) { return d.msg_send; });

	var positionScale = d3.scale.linear().domain([minMsg, meanMsg, maxMsg]).range(friendZoneRange);
	
	data.friends.forEach(function(d) {
		var position = positionScale(d.msg_send);
		var random = Math.floor((Math.random()*200)-100);
		position += random;
		d.x = ( position * Math.cos( angle ) + width/2 );
		d.y = ( position * Math.sin( angle ) + height/2 );
		angle += increase;
	});
};

function runDate() {
	dateInterval = setInterval(function() {
		currentDate.add('minutes', 30);
		d3.select("#date").text(currentDate.format('LLLL'));
	}, eventsInterval);
};

function simulator() {
	simulatorInterval = setInterval(function() {

		var random = Math.floor((Math.random()*10));
		if(random > 5 && randomSimulator) {
			return;
		}
		
		if(data.friends.length) {
			var randomUserData = data.friends[Math.floor(Math.random()*data.friends.length)];
			var randomUser = d3.selectAll("#friend-"+randomUserData.id);
			if(randomUser.classed("on")) {
				// TODO delete friend_login event
				var eventsId = Object.keys(events);
				var eventId = eventsId[Math.floor(Math.random()*eventsId.length)];
				var eventFunction = events[eventId];
				eventFunction(randomUser);
			} else {
				events['friend_login'](randomUser);
			}
		} else {
			events['add_friend']();
		}

	}, eventsInterval);
};


function update() {
	
	generateFriendsGrid();
	
	var friends = svg.selectAll(".friend")
		.data(data.friends);

	friends.enter().append("circle")
		.attr("class", "circle friend hidden")
		.attr("id", function(d) {
			return "friend-"+d.id;
		})
		.attr("r", 25)
		.attr("class", "circle friend on");

	friends.exit()
		.remove();

	friends.transition()
		.attr("cx", function(d) {
			return d.x;
		})
		.attr("cy", function(d) {
			return d.y;
		});

};

var animations = {
	off: function(el) {
		el.classed("on", false)
			.classed("off", true);
	},
	on: function(el) {
		el.classed("off", false)
			.classed("on", true);
	},
	relation: function(source, target) {
		var sourceData = {};
		if(source.classed("me")) {
			sourceData = meData;
		} else {
			sourceData = source.data()[0];
		}
		
		var targetData = {};
		if(target.classed("me")) {
			targetData = meData;
		} else {
			targetData = target.data()[0];
		}

		var line = svg.append("line")
			.classed("relation", true)
			.attr("x1", sourceData.x)
			.attr("y1", sourceData.y)
			.attr("x2", sourceData.x)
			.attr("y2", sourceData.y)
			.transition()
			.duration(1000)
				.attr("x2", targetData.x)
				.attr("y2", targetData.y)
				.transition()
				.delay(1000)
				.duration(500)
					.attr("x1", targetData.x)
					.attr("y1", targetData.y)
					.remove();
	}
};

var events = {
	friend_login: function(el) {
		animations.on(el);
	},
	friend_logout: function(el) {
		animations.off(el);
	},
	recept_message: function(el) {
		animations.relation(el, me);
	},
	sendMessage: function(el) {
		animations.relation(me, el);
	},
	messageFriendToFriend: function(el) {
		var randomUserData = data.friends[Math.floor(Math.random()*data.friends.length)];
		var randomUser = d3.selectAll("#friend-"+randomUserData.id);
		animations.relation(el, randomUser);
	},
	add_friend: function(el) {
		var newFriendId = data.friends.length + 1;
		var newFriend = { id: newFriendId, msg_send: 0, actif: true };
		data.friends.push(newFriend);
		update();
	}
};

d3.select("#date").text(currentDate.format('LLLL'));

var svg = d3.select("#graph").append("svg")
	.attr("width", width)
    .attr("height", height)
    .attr("class", "graph");

var me = svg.append("circle")
	.attr("class", "circle me hidden")
	.attr("r", 50)
	.attr("cx", width/2)
	.attr("cy", height/2);

me.classed("hidden", false);
me.classed("on", true);

me.on("click", function(d) {

	if (simulatorInterval) {
		speed = 0.1;
		window.clearInterval(simulatorInterval);
		window.clearInterval(dateInterval);
		simulatorInterval = false;
	} else {
		speed = 1;
		simulator();
		runDate();
	}

});
