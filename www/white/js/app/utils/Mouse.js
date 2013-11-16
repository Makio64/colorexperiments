define(['app/app'], function() {

	var Mouse = function () {
		this.x = 0;
		this.y = 0;
		document.addEventListener('mousemove', this.getPosition.bind(this), false);
	};

	Mouse.prototype = {
		getPosition: function(event) {
			this.x = (event.clientX / window.innerWidth) - 0.5;
			this.y = (event.clientY / window.innerHeight) - 0.5;
		}
	};

	return Mouse;
});