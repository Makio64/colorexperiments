define([
	//'dat.gui',
	'app/utils/Constant',
	'app/utils/Mouse',
	'app/utils/Resize',
	'app/utils/AudioAnalyzer',
	'app/geometries/TetrahedronGeometry',
	'app/entities/StoryBoard',
	'app/entities/ParticleTrail',
	'app/entities/ParticleAssembler',
	'app/entities/IncidentRay',
	'app/entities/Prism',
	'app/helpers/Stats',
	'app/helpers/GridHelper',
	'app/helpers/CameraHelper'
], function(/*GUI,*/ Constant, Mouse, Resize, AudioAnalyzer, TetrahedronGeometry, StoryBoard, ParticleTrail, ParticleAssembler, IncidentRay, Prism, Stats, GridHelper, CameraHelper) {


	var App = function() {

		// App basics
		this.constant = new Constant();
		this.mouse = new Mouse();
		this.storyBoard = new StoryBoard(this);
		this.spectrum = ["#760CDD", "#00B0F1", "#00F1C3", "#92D14E", "#FFC000", "#F3FF00", "#DD6008", "#333333"];

		// Set up renderer and stuffs
		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById('canvas').appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();

		// Add the main camera
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
		this.camera.position.x = 10;
		this.camera.position.z = 1000;
		this.camera.lookAt(this.scene.position);
		this.camera.shakeForce = 0;

		// Set up resize utility
		var resize = new Resize(this.renderer, this.camera);

		// Launch preload phase
		this.preload();

	};

	App.prototype = {

		preload: function() {
			var that = this;
			var loader = document.getElementById("loader");
			var logo = document.getElementById("logo");
			var count = document.getElementById("count");

			// Load song and get loaded percentage
			this.audioAnalyzer = new AudioAnalyzer("sounds/What_We_Got_To_Lose_by_The_Juveniles.ogg");
			var interval = setInterval(function() {
				count.innerText = ~~ (that.audioAnalyzer.percentLoaded) + "%";

				// On load complete
				if (that.audioAnalyzer.percentLoaded == 100) {
					clearInterval(interval);

					// Remove loader
					if (loader.parentNode) {
						loader.parentNode.removeChild(logo);
						loader.parentNode.removeChild(loader);
					}

					// Init scene
					that.init();

					setTimeout(function() {
						that.launchIntroduction();
					}, 1000);
				}
			}, 1);
		},

		init: function() {
			var that = this;
			this.updatedFunctions = [];
			this.shakeCount = 0;

			// Cube Map
			var texture = THREE.ImageUtils.loadTexture("img/2.jpg");
			this.cubeMap = new THREE.Mesh(new THREE.CubeGeometry(2000, 2000, 2000), new THREE.MeshBasicMaterial({
				color: 0xFFFFFF,
				map: texture,
				side: THREE.BackSide
			}));
			this.scene.add(this.cubeMap);

			this.addLights();

			// Objects
			this.particleAssembler = new ParticleAssembler();
			this.whiteLight = new ParticleTrail("whitelight", this.scene, 30);

			this.prism = new Prism(this.scene);

			this.updatedFunctions.push(function(delta, now) {
				that.update(delta, now);
			});

			// Loop
			var lastTimeMsec = null;
			requestAnimationFrame(function animate(nowMsec) {
				requestAnimationFrame(animate);

				// Get time
				lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
				var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
				lastTimeMsec = nowMsec;

				// call each update function
				that.updatedFunctions.forEach(function(updateFn) {
					updateFn(deltaMsec / 1000, nowMsec / 1000);
				});

			});

			//this.createGUI();
			//this.debug();
		},

		update: function(delta, now) {
			// Handle updated things
			if (this.storyBoard.step == "introduction") {
				if (this.audioAnalyzer.getAverageFrequencies() > 100) {
					this.camera.shakeForce = (this.audioAnalyzer.getAverageFrequencies() - 100) * 3;
					TweenMax.to(this.camera, 0.5, {
						shakeForce: 0,
						onCompleteParams: [this],
						onComplete: function (app) {
							app.shakeCount += 1;
							if (app.shakeCount == 14) {
								app.storyBoard.step = "showColors";
								app.storyBoard.showColors();
							}
						}
					});
				}
				this.whiteLight.update(Math.cos(now) / 2);
				this.prism.update(Math.sin(now) / 20, Math.cos(now) / 10);
			} else if (this.storyBoard.step == "showColors") {
				this.whiteLight.update(Math.cos(now) / 2);
			} else if (this.storyBoard.step == "incidence") {
				this.prism.coolPosition(Math.cos(now) / 10);
			}

			// Camera update
			this.camera.position.x = 0 + this.camera.shakeForce * 2 * Math.random() - this.camera.shakeForce;
			this.camera.position.y = 0 + this.camera.shakeForce * 2 * Math.random() - this.camera.shakeForce;

			// Render
			this.renderer.render(this.scene, this.camera);
		},

		launchIntroduction: function() {
			this.storyBoard.introduction().play();
		},

		addLights: function() {
			// Create the object
			var ambientLight = new THREE.AmbientLight(0x888888);
			var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
			var directionalLight1 = new THREE.DirectionalLight(0xFFFFFF);
			var directionalLight2 = new THREE.DirectionalLight(0xFFFFFF);
			var directionalLight3 = new THREE.DirectionalLight(0xFFFFFF);

			// Set cast shadow behavior
			directionalLight.position.set(0, 1, 0).normalize();
			directionalLight1.position.set(1, 1, 1).normalize();
			directionalLight2.position.set(-1, -1, -1).normalize();

			this.scene.add(ambientLight);
			this.scene.add(directionalLight);
			this.scene.add(directionalLight1);
			this.scene.add(directionalLight2);
		},

		createGUI: function() {
			this.gui = new dat.GUI();

			var cameraFolder = this.gui.addFolder('Camera');
			cameraFolder.add(this.camera.position, 'z', 1, 1500).name("Zoom").step("1");
			cameraFolder.add(this.camera.position, 'y', 1, 1500).name("Up / Down").step("1");

			/*var prismFolder = this.gui.addFolder('Prism');
			prismFolder.add(this.prism.mesh.rotation, 'x', 0, 360 * M_PI / 180).name("Rotation X").step("0.1");
			prismFolder.add(this.prism.mesh.rotation, 'y', 0, 360 * M_PI / 180).name("Rotation Y").step("0.1");
			prismFolder.add(this.prism.mesh.rotation, 'z', 0, 360 * M_PI / 180).name("Rotation Z").step("0.1");

			prismFolder.add(this.prism.mesh.position, 'x', 0, 200).name("Position X").step("1");
			prismFolder.add(this.prism.mesh.position, 'y', 0, 200).name("Position Y").step("1");
			prismFolder.add(this.prism.mesh.position, 'z', 0, 200).name("Position Z").step("1");*/

			// Open each folder
			var e = document.createEvent('Events');
			e.initEvent("click");
			var folders = document.querySelectorAll(".dg li.title");
			for (var i = 0, len = folders.length; i < len; i++) {
				folders[i].dispatchEvent(e);
			}
		},

		debug: function() {
			// Helpers
			/*var helpers = [];
			helpers.push(
				new THREE.GridHelper(50, 2),
				new THREE.AxisHelper(500),
				new THREE.CameraHelper(this.camera)
			);

			for (var j= helpers.length - 1; j>= 0; j--) {
				this.scene.add(helpers[i]);
			}*/

			// Perf
			var stats = new Stats();
			stats.setMode(0); // 0: fps, 1: ms

			// Align top-left
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';

			document.body.appendChild(stats.domElement);

			setInterval(function() {

				stats.begin();
				stats.end();

			}, 1000 / 60);
		}

	};

	// BG stromboscop

	return App;
});