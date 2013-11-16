function checkIfStartIsFinished(friendsData) {
	for(var i=0, l=friendsData.length; i < l; i++) {
		var friendData = friendsData[i];
		if(!friendData.init) {
			return false;
		}
	}

	return true;
};

function generateRelations(relationsData, friendsData) {
	return relationsData.map(function(d) {
		if(d.source != 0) {
			d.source = _.findWhere(friendsData, {id: d.source});	
		} else {
			d.source = meData;
		}
		
		if(d.target != 0) {
			d.target = _.findWhere(friendsData, {id: d.target});	
		} else {
			d.target = meData;
		}

		return d;
	});
};

function generateFriendsGrid(friendsData) {
	var increase = Math.PI * 2 / friendsData.length;
	var angle = 0;
	
	var minMsg = d3.min(friendsData, function(d) { return d.msg_send; });
	var meanMsg = d3.mean(friendsData, function(d) { return d.msg_send; });
	var maxMsg = d3.max(friendsData, function(d) { return d.msg_send; });

	var positionScale = d3.scale.linear().domain([minMsg, meanMsg, maxMsg]).range(friendZoneRange);
	
	return friendsData.map(function(d) {
		var position = positionScale(d.msg_send);
		var random = Math.floor((Math.random()*200)-100);
		position += random;
		d.x = ( position * Math.cos( angle ) + width/2 );
		d.y = ( position * Math.sin( angle ) + height/2 );
		angle += increase;
		return d;
	});
};

function simulator(friendsData, events) {
	var startIsFinished = false;
	setInterval(function() {
		if(!startIsFinished) {
			if(checkIfStartIsFinished(friendsData)) {
				startIsFinished = true;
			}	
		} else {
			var random = Math.floor((Math.random()*10));
			var randomUserData = friendsData[Math.floor(Math.random()*friendsData.length)];
			var randomUser = d3.selectAll("#friend-"+randomUserData.id);
			if(random > 5) {
				if(randomUser.classed("on")) {
					var eventsId = Object.keys(events);
					var eventId = eventsId[Math.floor(Math.random()*eventsId.length)];
					var eventFunction = events[eventId];
					eventFunction(randomUser);
				} else {
					events['friend_login'](randomUser);
				}
			}
		}
	}, 500);
};

function update(relationsData, friendsData, relations, friends) {
	
	var friendsData = generateFriendsGrid(friendsData, friendZoneRange);
	var relationsData = generateRelations(relationsData, friendsData, meData);

	var friends = svg.selectAll(".friend")
		.data(friendsData);

	var relations = svg.selectAll(".relation")
		.data(data.relations);

	relations.enter().append("line")
		.attr("class", "relation");

	friends.exit().remove();

	friends.enter().append("circle")
		.attr("class", "circle friend on")
		.attr("id", function(d) {
			return "friend-"+d.id;
		})
		.attr("cx", function(d) {
			return d.x;
		})
		.attr("cy", function(d) {
			return d.y;
		})
		.attr("r", 25);

	friends.transition()
		.attr("cx", function(d) {
			return d.x;
		})
		.attr("cy", function(d) {
			return d.y;
		});

};