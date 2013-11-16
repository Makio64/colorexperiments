define(['app/app'], function() {

	var StoryBoard = function() {
		this.step = "introduction";
	};

	StoryBoard.prototype = {

		introduction: function() {
			var introTimeline = new TimelineMax({
				paused: true
			});
			introTimeline.append(new TweenMax(app.camera.position, 12, {
				z: 600,
				ease: Quad.easeIn
			}));
			introTimeline.append(new TweenMax(app.camera.position, 6, {
				z: 200,
				ease: Quad.easeOut
			}));

			return introTimeline;
		},

		showColors: function() {
			var that = this;
			var intervalCount = 0;
			setTimeout(function() {
				var interval = setInterval(function() {
					/*this.app.prism.materials[0].opacity = (this.app.prism.materials[0].opacity == 1) ? 0 : 1;
					this.app.prism.materials[1].wireframe = false;*/
					app.prism.materials[0].color.set(app.spectrum[intervalCount]);
					app.prism.randomRotation();
					intervalCount += 1;
					if (intervalCount === 6) {
						that.incidence();
						clearInterval(interval);
						that.step = "incidence";
					}
				}, 300);
			}, 300);
			app.whiteLight.fade();
		},

		incidence: function() {
			app.prism.materials[0].color.set("#111111");
			TweenMax.to(app.prism.mesh.rotation, 0.3, {
				x: 1,
				z: 0
			});
			TweenMax.to(app.prism.mesh.scale, 0.3, {
				x: 1,
				y: 1,
				z: 1,
				ease: Bounce.easeInOut
			});
			app.whiteLight.incidence();
			app.particleAssembler.createParticles();

			setTimeout(function() {
				this.end();
			}.bind(this), 15000);
		},

		end: function() {

			var volume = 1;
			var interval = setInterval(function () {
				volume -= 0.1;
				if (volume <= 0.1) {
					document.getElementById("canvas").className = "transition-out";
					var div = document.createElement('div');
					div.id = "logo";
					div.innerHTML = '<img src="img/logo.png" alt="Dispersed logo"><a href="javascript:void(0)" class="launchAgain" onClick="window.location.href=window.location.href">Launch again</a>';
					document.body.appendChild(div);
					clearInterval(interval);
					app.audioAnalyzer.sourceNode.noteOff(0);
					return;
				}
				app.audioAnalyzer.changeVolume(volume);
			}, 50);
		}
	};

	return StoryBoard;
});