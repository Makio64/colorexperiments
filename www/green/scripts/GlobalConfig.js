var CONSTANT = {
	windowHalfX : window.innerWidth / 2,
	windowHalfY : window.innerHeight / 2,
	files : {
		sound :{
			id: 'forestTemple',
			path: 'sounds/forest.temple.mp3'
		},
		cellTexture1Path: "images/clound.png",
		cellTexture2Path: "images/lavacell.jpg"
	}

}

var CONFIG = {
	stats: '',
	gui: '',
	debug: false,
	angle: 0,
	defaultRadiusCamera: 1000,
	radiusCamera: 1000,
	axisHelper: true,
	container:document.getElementById('scene3D'),
	mesh: {
		material:''
	},
	sound : '',
	soundDebug: false,
	filmEffect: true,
	movingCamera: false,
	cameraLimit: 100000,
	clickCount: 0,
	loadDebugModule: function (scene) {
		if(this.debug){

			if(this.axisHelper) scene.add(new THREE.AxisHelper(1000));

			this.stats = new Stats();
			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.left = '0px';
			this.stats.domElement.style.top = '0px';
			document.body.appendChild( this.stats.domElement );
			this.gui = new dat.GUI();
		}
	},
	updateConfig: function () {
		this.stats.begin();
		this.stats.end();
	},
	pauseSound: function () {
    	this.sound.pause('forestTemple');
	},
	playSound: function () {
		this.sound.play('forestTemple');
	}
}


