define(['app/app'], function() {

	var ParticleTrail = function(name, scene, number) {
		this.name = name;
		this.scene = scene;
		this.number = number || 150;
		this.particles = [];
		this.verticesAngle = 0;
		this.init();
	};

	ParticleTrail.prototype = {
		init: function() {
			var RADIUS = 20;
			var that = this;
			var geometry = new THREE.PlaneGeometry(0.1, 100, 1, 10);
			for (var i = 0; i < this.number; i++) {

				// Color
				var object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
					transparent: true,
					opacity: 0,
					color: 0xFFFFFF,
					side: THREE.DoubleSide
				}));

				// Fade In
				TweenMax.to(object.material, 1.8, {
					opacity: 1,
					delay: 0.40 * Math.random() + 1.2
				});

				// Set up properties
				object.position.z = app.camera.position.z + 100;
				object.rotation.x = 90 * deg2rad;
				object.type = that.name;
				object.angle = 0;
				object.force = ~~ (Math.random() * 20) + 1;
				object.time = ~~ (Math.random() * 20) + 1;
				object.speed = 0.001 + Math.random() * 0.0004;

				object.orbit = RADIUS * 0.5 + (RADIUS * 0.5 * Math.random());
				object.zOffset = ~~ (Math.random() * 20) + 10;

				this.particles.push(object);
				that.scene.add(object);
			}
		},

		update: function(radius) {
			for (var i = 0; i < this.particles.length; i++) {
				var particle = this.particles[i];

				particle.speed = 0.001 + Math.random() * 0.0004;
				particle.angle += particle.speed + app.camera.position.z * particle.speed / 10000;
				particle.time += particle.speed * 5;

				particle.position.x = Math.cos(i + particle.angle) * particle.orbit;
				particle.position.y = Math.sin(i + particle.angle) * particle.orbit;
				particle.position.z = app.camera.position.z + particle.zOffset + Math.sin(particle.time) * particle.force;
			}
		},

		fade: function () {
			for (var i = 0; i < this.particles.length; i++) {
				var particle = this.particles[i];
				var timeline = new TimelineMax();
				timeline.append(new TweenMax(particle.material, 0.3, {
					opacity: 0.2,
					delay: (Math.random() * (0.3 - 0.1)) + 0.1,
					ease: Sine.easeIn
				}));
				timeline.append(new TweenMax(particle.material, 1, {
					opacity: 0.2
				}));
				timeline.append(new TweenMax(particle.material, 0.3, {
					opacity: 1,
					delay: (Math.random() * (0.3 - 0.1)) + 0.1,
					ease: Sine.easeOut
				}));
				timeline.play();
			}
		},

		incidence: function() {
			for (var i = 0; i < this.particles.length; i++) {

				var particle = this.particles[i];
				TweenMax.to(particle.position, 0.6, {
					x: 0,
					y: Math.sin(i + particle.angle) * particle.orbit,
					z: -(app.camera.position.z + particle.zOffset + Math.sin(particle.time) * particle.force)
				});
				TweenMax.to(particle.material, 0.6, {
					opacity: 0
				});
			}
		}
	};

	return ParticleTrail;
});