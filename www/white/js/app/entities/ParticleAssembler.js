define(['app/app'], function() {

	var ParticleAssembler = function() {
		this.engines = [];
	};

	ParticleAssembler.prototype = {
		createParticles: function() {

			var l = app.spectrum.length;

			for (var i = 0; i < l; i++) {

				// Create the engine
				var engine = new ParticleEngine(app.scene);

				// Set its particles
				var color = this.getColor(app.spectrum[i]);

				var particle = {
					positionStyle: Type.CUBE,
					positionBase: new THREE.Vector3(-10, 20, 0),
					positionSpread: new THREE.Vector3(10, 0, 10),

					velocityStyle: Type.CUBE,
					velocityBase: new THREE.Vector3(~~(Math.random() * 720) - 360, ~~(Math.random() * 720) - 360, ~~(Math.random() * 720) - 360),
					velocitySpread: new THREE.Vector3(80, 50, 80),

					accelerationBase: new THREE.Vector3(0, 10, 0),

					angleBase: 0,
					angleSpread: 720,
					angleVelocityBase: 0,
					angleVelocitySpread: 720,

					particleTexture: THREE.ImageUtils.loadTexture('img/particles/spark.png'),

					sizeTween: new Tween([0, 0.1], [1, 50]),
					colorBase: new THREE.Vector3().fromArray(color),
					opacityTween: new Tween([0.7, 1], [1, 0]),
					blendStyle: THREE.AdditiveBlending,

					particlesPerSecond: 100,
					particleDeathAge: 2.5
					/*,
					emitterDeathAge    : 60*/
				};
				engine.setValues(particle);
				this.engines.push(engine);
			}

			for (var j = 0; j < this.engines.length; j++) {
				this.engines[j].initialize();
			}

			// Update it
			app.updatedFunctions.push(function(delta, now) {
				for (var j = 0; j < this.engines.length; j++) {
					this.engines[j].update(delta * 0.5);
				}
			}.bind(this));
		},
		
		getColor: function(hexValue) {

			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue);

			var r, g, b;
			r = parseInt(result[1], 16);
			g = parseInt(result[2], 16);
			b = parseInt(result[3], 16);

			r /= 255, g /= 255, b /= 255;
			var max = Math.max(r, g, b),
				min = Math.min(r, g, b);
			var h, s, l = (max + min) / 2;

			if (max == min) {
				h = s = 0; // achromatic
			} else {
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch (max) {
					case r:
						h = (g - b) / d + (g < b ? 6 : 0);
						break;
					case g:
						h = (b - r) / d + 2;
						break;
					case b:
						h = (r - g) / d + 4;
						break;
				}
				h /= 6;
			}

			return [h, s, l];
		}
	};

	return ParticleAssembler;
});