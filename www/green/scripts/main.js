soundManager.setup({
	url: 'swf/',
	flashVersion: 9, 
	debugMode: CONFIG.soundDebug,
	onready: function() {
		CONFIG.sound = soundManager.createSound({
			volume: 50,
			id: CONSTANT.files.sound.id,
			url: CONSTANT.files.sound.path
		});
	}
});

var CameraCtrl = {
	stepBack : function (range) {
		TweenLite.to(
			CONFIG, 
			2, 
			{radiusCamera: CONFIG.radiusCamera + range});
	},
	resetRadiusCameraPosition: function () {
		TweenLite.to(
			CONFIG, 
			2, 
			{radiusCamera: CONFIG.defaultRadiusCamera});
	}	
}

var clock = new THREE.Clock();
var uniforms;
var composer;

var Experiment,
	__bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Experiment = (function () {
	var camera, 
		mainCell,
		scene, 
		renderer
		;
		var mouse = {
			x: 0,
			y: 0
		}

	return { 
		init: function () {
			var self = this;
			time = 0;
    		this.animate = __bind(this.animate, this);

			camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, CONFIG.cameraLimit );
			camera.position.x = 0;
			camera.position.y = 0;
			camera.position.z = 200;
			CONFIG.radiusCamera = 5000;
			CameraCtrl.camera = camera;

			scene = new THREE.Scene();

			CONFIG.loadDebugModule(scene);

			uniforms = {

				fogDensity: { type: "f", value: 0 },
				fogColor: { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
				time: { type: "f", value: 1.0 },
				resolution: { type: "v2", value: new THREE.Vector2(0,0) },
				uvScale: { type: "v2", value: new THREE.Vector2( 3.0, 1.0 ) },
				texture1: { type: "t", value: THREE.ImageUtils.loadTexture( CONSTANT.files.cellTexture1Path ) },
				texture2: { type: "t", value: THREE.ImageUtils.loadTexture( CONSTANT.files.cellTexture2Path ) }

			};

			uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
			uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

			CONFIG.mesh.material = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'vertexShader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentShader' ).textContent
			} );

			CONFIG.mesh.materialMain = new THREE.ShaderMaterial( {

				uniforms: uniforms,
				vertexShader: document.getElementById( 'vertexShader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentShader' ).textContent

			} );

			mainCell = new Cell()
			mainCell.material = CONFIG.mesh.materialMain;
			mainCell.generation = 0
			mainCell.scale.set(1, 1, 1)
			scene.add(mainCell)
			
			this.loaded = false;

			// Render
			renderer = new THREE.WebGLRenderer({antialias: true});
			renderer.setSize( window.innerWidth, window.innerHeight );
			CONFIG.container.appendChild( renderer.domElement );
			renderer.autoClear = false;

			var renderModel = new THREE.RenderPass( scene, camera );
			var effectBloom = new THREE.BloomPass( 1.25 );
			var effectFilm = new THREE.FilmPass( 0.35, 0.95, 2048, false );

			if(CONFIG.filmEffect) effectFilm.renderToScreen = true;

			composer = new THREE.EffectComposer( renderer );

			composer.addPass( renderModel );
			composer.addPass( effectBloom );
			composer.addPass( effectFilm );


			// Events 
			CONFIG.container.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
			window.addEventListener( 'resize', this.onWindowResize, false );


			// DAT GUI
			if(CONFIG.debug){
				CONFIG.gui.add(CONFIG, 'radiusCamera', 0, 10000).step(3).name('camera radius').listen()
				CONFIG.gui.add(CONFIG, 'playSound').name('Play sound')
				CONFIG.gui.add(CONFIG, 'pauseSound').name('Pause sound')

			}
			this.onWindowResize();
			this.animate();

		},
		showExperiment: function () {
			var self = this;
			TweenLite.to(
				CONFIG, 
				1, 
				{radiusCamera: 10, ease: Quart.easeOut, onComplete:function () {
					CONFIG.container.addEventListener( 'click', self.onDocumentClick, false );
				}});
		},
		animate: function () {
			requestAnimationFrame(this.animate);
			this.update();

			if(CONFIG.debug) CONFIG.updateConfig();

			renderer.render(scene, camera);

		},
		update : function () {

			// camera
			CONFIG.angle = CONFIG.angle + 0.005;
			camera.position.x = Math.cos(CONFIG.angle)*CONFIG.radiusCamera;
			camera.position.y = Math.sin(CONFIG.angle)*CONFIG.radiusCamera;
			camera.lookAt( scene.position );
			

			var delta = 5 * clock.getDelta();

			uniforms.time.value += 0.05 * delta;
			renderer.clear();
			composer.render( 0.01 );

		},
		onDocumentClick: function (event) {
			CONFIG.clickCount++;
			if(CONFIG.clickCount == 1){
				CONFIG.playSound();
				mainCell.setAsVirus();
				CameraCtrl.stepBack(1500);
				setTimeout(function () {
					mainCell.multiply();
					CameraCtrl.stepBack(1500);
				}, 3000)
			}else{
				if(CONFIG.radiusCamera < 10000) {
					CONFIG.playSound();
					CameraCtrl.stepBack(1500);
				}else{
					CameraCtrl.resetRadiusCameraPosition();
				}

			}
		},
		onDocumentMouseMove: function(event) {
			event.preventDefault();
			mouse.x = event.clientX - CONSTANT.windowHalfX;
			mouse.y = event.clientY - CONSTANT.windowHalfY;

		},
		onWindowResize: function() {

			CONSTANT.windowHalfX = window.innerWidth / 2;
			CONSTANT.windowHalfY = window.innerHeight / 2;

			if (uniforms) {
				uniforms.resolution.value.x = window.innerWidth;
				uniforms.resolution.value.y = window.innerHeight;
			};

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
			composer.reset();

			$('body, #scene3d').css({height:window.innerHeight+"px", width:window.innerWidth+"px"})

		}
	}
})()

var loadSplashScreen = function () {
	var loadingTl = new TimelineLite();
	var time = 0;
	var blurElement= {a:0};

	// hidding elementz
	$('.loadingInfected').css({opacity:0, visibility:'hidden'})
	$('.loadingNormal').css({opacity:0, visibility:'hidden'})

	loadingTl.to('.loadingNormal', 1, {autoAlpha: 1, ease: Back.easeIn}, time )

	loadingTl.to('.loadingContainer', .4, {autoAlpha: 0, ease: Circ.easeIn, scaleX: 220, scaleY: 220}, time +=3 )
	loadingTl.to(blurElement, 0.2, {a: 20, onUpdate: applyBlur }, time)
	function applyBlur () {
		    TweenMax.set($('.loadingNormal') , {webkitFilter:"blur(" +blurElement.a + "px)"});
	}
	setTimeout(function () {
		$('.loadingBackground').css({opacity:0, visibility:'hidden'});
		$('.loadingBackground').css({display:'none'});
		$('.loadingInfected').css({display:'none'})
		$('.loadingNormal').css({display:'none'})
		Experiment.showExperiment();
	}, 3100)
	

}

$(document).ready(function () {
	Experiment.init();
	loadSplashScreen();
})
