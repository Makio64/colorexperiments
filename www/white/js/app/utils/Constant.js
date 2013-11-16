define(['app/app'], function() {

	var Constant = function() {
		window.M_PI = Math.PI;
		window.M_2PI = Math.PI * 2;
		window.M_PI2 = Math.PI / 2;
		window.M_PI4 = Math.PI / 4;
		window.M_PI8 = Math.PI / 8;

		window.deg2rad = Math.PI / 180;
		window.rad2deg = 180 / Math.PI;
	};

	return Constant;
});