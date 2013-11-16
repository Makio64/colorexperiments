define(['app/app'], function() {

	var Resize = function(renderer, camera) {
		this.camera = camera;
		this.renderer = renderer;
		window.addEventListener('resize', this.handleResize.bind(this), false);
	};

	Resize.prototype = {
		handleResize: function() {
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		},

        remove: function() {
            window.removeEventListener('resize', callback);
        }
	};

	return Resize;
});