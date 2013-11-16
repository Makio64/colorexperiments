var Constantes = function () {
    if (typeof Constantes.instance === 'object') {
        return Constantes.instance;
    }

    this.debug = false;
    
    this.cameraX = 0;
    this.cameraY = 300;
    this.cameraZ = 500;

    this.animParticles = false;
    this.animAsteroids = false;
    this.animStars = true;

    this.animIntro = false;
    this.sound = true;

    this.shake = false;
    this.explode = false;

    this.particleSpeed = 40;
    this.particleOpacity = 0;
    
    Constantes.instance = this;
};

var k = new Constantes();
var first = true;
var cometInterval;

var launchExperiment = function(){
    if(first){
        // mouvement de caméra
        var cam = new Camera();
        cam.start();
        var part = new Particles();
        var sounds = new Sound();
        var lines = new Lines();
        var asteroids = new Asteroids();
        var bd = new Bd();
        var stars = new Stars();

        // Lecture son
        sounds.fall();

        // animation des particules rays
        var delayParticles = 1000;
        setTimeout(function(){
            k.animParticles = true;
            k.animAsteroids = true;
        }, delayParticles);

        // suppression des étoiles
        setTimeout(function(){
            stars.remove();
        },1000);

        setTimeout(function(){
            part.speedUp();
        },2000);

        setTimeout(function(){
            lines.animate();
            cam.fall();
        }, 3000);

        setTimeout(function(){
            // random shake camera
            cometInterval = setInterval(function(){
                if(Math.random() > 0.25){
                    
                    asteroids.add();                    
                    setTimeout(function(){
                        sounds.comet();
                    },500)
                    setTimeout(function(){
                        cam.shake();
                    }, 1000);
                }
            }, 2000);
        }, 4000);
            

        first = false;

    }
}

window.onload = function(){

    var link = document.getElementById("go");
    link.addEventListener("click",function(e){
        e.preventDefault();
        launchExperiment();
        e.currentTarget.className += "exit";
    },false);

    
    var gui = new dat.GUI(); 
    if(!k.debug) gui.close();
    
    var control_intro = gui.add(k, 'animIntro').name('Launch Intro').listen();
    control_intro.onChange(function(value){
        launchExperiment();
    });

    var control_sound = gui.add(k, 'sound').name('sound');

    var control_particles = gui.add(k, 'animParticles').name('anim particles').listen();
    var control_asteroids = gui.add(k, 'animAsteroids').name('anim asteroids').listen();
    var controle_speed = gui.add(k, 'particleSpeed', 0, 70).name('particles speed').step(1).listen();

    var control_shake = gui.add(k, 'shake').listen();
    control_shake.onChange(function(value) {
        var cam = new Camera();
        cam.shake();
    });

    var control_explode = gui.add(k, 'explode').listen();
    control_explode.onChange(function(value){
        var e = new Explosion();
        e.explode();
    });

    var control_cameraZ = gui.add(k, 'cameraZ', -500, 1000).step(1).name('camera z');
    control_cameraZ.onChange(function(value) {
        var cam = new Camera();
        cam.position.z = value;
    });
    var control_cameraY = gui.add(k, 'cameraY', -500, 500).step(1).name('camera y').listen();
    control_cameraY.onChange(function(value) {
        var cam = new Camera();
        cam.position.y = value;
    });
    var control_cameraX = gui.add(k, 'cameraX', -500, 500).step(1).name('camera x');
    control_cameraX.onChange(function(value) {
        var cam = new Camera();
        cam.position.x = value;
    });
    

};

var clock = new THREE.Clock();
var uniforms, composer, camera, plane;

var Freefall = (function(){

	if( !init() )   animate();



	function init(){

		window.sounds = new Sound();

		/*renderer = new THREE.WebGLRenderer({
            antialias       : true, // to get smoother output
            preserveDrawingBuffer   : true,  // to allow screenshot
            clearAlpha: 0
        });
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);*/

        if(k.debug){
            // add Stats.js - https://github.com/mrdoob/stats.js
            stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.bottom   = '0px';
            document.body.appendChild( stats.domElement );    
        }

        // create a scene
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0x6DD5F7, 600, 1600 );

        this.scene = scene;

        // put a camera in the scene
        camera = new Camera();
        scene.add(camera);

        // LIGHT
        // var light   = new THREE.AmbientLight( 0x6DD5F7 );
        // scene.add( light );

        hemiLight = new THREE.HemisphereLight( 0x000000, 0x0000FF, 1 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 1000, 0 );
        scene.add( hemiLight );

        var geo = new THREE.CubeGeometry(15000, 15000, 15000);
        var mat = new THREE.MeshPhongMaterial({
            color: 0x000000,
            side: THREE.BackSide,
            fog: false
        });
        var box = new THREE.Mesh(geo, mat);
        scene.add(box);



        // ADD PARTICLES TO THE SCENE
		var particles = new Particles();

        // LINES
        var lines = new Lines();

        // EXPLOSION
        var explosion = new Explosion();
        explosion.add();


        // ASTEROiDS
        var asteroids = new Asteroids();

        // STARS
        var stars = new Stars();
        stars.add();

        // BD CHARS
        var bd = new Bd();

        
		// ADD PLAN TO THE SCENE
        uniforms = {
            fogDensity: { type: "f", value: 0 },
            fogColor: { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2() },
            uvScale: { type: "v2", value: new THREE.Vector2( 6, 2 ) },
            texture1: { type: "t", value: THREE.ImageUtils.loadTexture( "img/textures/cloud.png" ) },
            texture2: { type: "t", value: THREE.ImageUtils.loadTexture( "img/textures/lavatile.jpg" ) }
        };
        
        uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
        uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

        var material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent
        } );

        plane = new THREE.Mesh(new THREE.CircleGeometry(7000, 100, 10, 10), material);
        plane.position = new THREE.Vector3(0,-5000,0);
        plane.rotation.x = -Math.PI*.5;
        plane.rotation.z = -Math.PI*.5;
        scene.add(plane);
        //var material = new THREE.MeshBasicMaterial();

        // mesh = new THREE.Mesh( new THREE.TorusGeometry( 1000, 500, 30, 30 ), material );
        // mesh.rotation.x = 0.3;
        // mesh.position.set(0,-100,0);
        
        // scene.add( mesh );

        renderer = new THREE.WebGLRenderer( {
            antialias       : true, // to get smoother output
            clearAlpha: 0
        });
        document.body.appendChild( renderer.domElement );
        renderer.autoClear = false;


		var renderModel = new THREE.RenderPass( scene, camera );
        var effectBloom = new THREE.BloomPass( 1.25 );
        var effectFilm = new THREE.FilmPass( 0.75, 0, 0, false ); // dernier param à TRUE = terrible !!

        effectFilm.renderToScreen = true;

        composer = new THREE.EffectComposer( renderer );

        composer.addPass( renderModel );
        composer.addPass( effectBloom );
        composer.addPass( effectFilm );

        
        onWindowResize();

        window.addEventListener( 'resize', onWindowResize, false );

	};

    function onWindowResize( event ) {

        uniforms.resolution.value.x = window.innerWidth;
        uniforms.resolution.value.y = window.innerHeight;

        renderer.setSize( window.innerWidth, window.innerHeight );

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        composer.reset();

    }

	// animation loop
    function animate() {

        // loop on request animation loop
        // - it has to be at the begining of the function
        // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
        requestAnimationFrame( animate );

        // do the render
        render();

        if(k.debug){
            // update stats
            stats.update();    
        }
        
    }

	// render the scene
    function render() {
        // variable which is increase by Math.PI every seconds - usefull for animation
        var PIseconds   = Date.now() * Math.PI;

        var delta = 5 * clock.getDelta();
        uniforms.time.value += 0.2 * delta;


        //camera.controls.update();

        // animation of particles
        if(k.animParticles){
            var particles = new Particles();
            particles.animate();
        }

        if(k.animAsteroids){
            var asteroids = new Asteroids();
            asteroids.animate();

            //plane.position.y += 1;
        }

        if(k.animStars){
            var s = new Stars()
            s.animate();
        }

        // actually render the scene
        renderer.clear();
        composer.render( 0.01 );

        // var cam = new Camera();
        // renderer.render(scene, cam);

    }

	render();
})();