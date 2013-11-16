var Constantes = function () {
    if (typeof Constantes.instance === 'object') {
        return Constantes.instance;
    }

    this.debug = true;
    
    this.cameraX = 0;
    this.cameraY = 300;
    this.cameraZ = 500;

    this.animParticles = false;
    this.animIntro = false;

    this.shake = false;

    this.particleSpeed = 20;
    
    Constantes.instance = this;
};

var k = new Constantes();
var first = true;

window.onload = function(){
    var gui = new dat.GUI();
    
    
    
    var control_intro = gui.add(k, 'animIntro').name('Launch Intro');
    control_intro.onChange(function(value){
        if(first){
            // mouvement de caméra
            var cam = new Camera();
            cam.start();   

            // animation des particules
            var delayParticles = 1000;
            setTimeout(function(){
                k.animParticles = true;
            }, delayParticles);

            // random shake camera
            setInterval(function(){
                if(Math.random() > 0.5){
                    cam.shake();    
                }
            }, 1000);

            setTimeout(function(){
                cam.fall();
            },2000);
            

            first = false;

        }
    });

    var control_particles = gui.add(k, 'animParticles').name('animated particles').listen();
    var controle_speed = gui.add(k, 'particleSpeed', 0, 50).name('particles speed').step(1);

    var control_shake = gui.add(k, 'shake').listen();
    control_shake.onChange(function(value) {
        var cam = new Camera();
        cam.shake();
    });

    var control_cameraZ = gui.add(k, 'cameraZ', -500, 1000).step(1).name('camera z');
    control_cameraZ.onChange(function(value) {
        var cam = new Camera();
        cam.position.z = value;
    });
    var control_cameraY = gui.add(k, 'cameraY', -500, 500).step(1).name('camera y');
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



var Freefall = (function(){
    var stats, scene, renderer, composer;
    var camera, cameraControl;

    if( !init() )   animate();

    // init the scene
    function init(){

        if( Detector.webgl ){
            renderer = new THREE.WebGLRenderer({
                antialias       : true, // to get smoother output
                preserveDrawingBuffer   : true,  // to allow screenshot
                clearAlpha: 0
            });
        }else{
            Detector.addGetWebGLMessage();
            return true;
        }
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById('container').appendChild(renderer.domElement);

        // add Stats.js - https://github.com/mrdoob/stats.js
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.bottom   = '0px';
        document.body.appendChild( stats.domElement );

        // create a scene
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0xffff00, 100, 16000 );

        this.scene = scene;

        // put a camera in the scene
        var camera = new Camera();
        scene.add(camera);

        // create a camera contol
        //cameraControls  = new THREEx.DragPanControls(camera);

        // transparently support window resize
        THREEx.WindowResize.bind(renderer, camera);
        // allow 'p' to make screenshot
        THREEx.Screenshot.bindKey(renderer);
        // allow 'f' to go fullscreen where this feature is supported
        if( THREEx.FullScreen.available() ){
            THREEx.FullScreen.bindKey();
        }

        // LIGHT
        var light   = new THREE.AmbientLight( 0x0000FF );
        scene.add( light );
        



        // ADD PARTICLES TO THE SCENE
        var particles = new Particles();

        // ADD PLAN TO THE SCENE
        window.plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 10, 10), new THREE.MeshBasicMaterial({color: 0x6DD5F7}));
        plane.position = new THREE.Vector3(0,-5000,0);
        plane.rotation.x = -Math.PI*.5
        scene.add(plane);

        // define the stack of passes for postProcessing
        composer = new THREE.EffectComposer( renderer );
        renderer.autoClear = false;

        var renderModel = new THREE.RenderPass( scene, camera );
        composer.addPass( renderModel );

        // var effectBloom = new THREE.BloomPass( 1.5 );
        // composer.addPass( effectBloom );

        var effectScreen= new THREE.ShaderPass( THREE.ShaderExtras[ "screen" ] );
        effectScreen.renderToScreen = true;
        composer.addPass( effectScreen );

        if(k.debug){
            var axes = new THREE.AxisHelper(50);
            axes.position = new THREE.Vector3(0,100,0);
            scene.add(axes);
        }
        

    };

    // animation loop
    function animate() {

        // loop on request animation loop
        // - it has to be at the begining of the function
        // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
        requestAnimationFrame( animate );

        // do the render
        render();

        // update stats
        stats.update();
    }

    // render the scene
    function render() {
        // variable which is increase by Math.PI every seconds - usefull for animation
        var PIseconds   = Date.now() * Math.PI;


        // update camera controls
        //cameraControls.update();
        // var cam = new Camera();
        // cam.lookAt( scene.position);

        // animation of particles
        if(k.animParticles){
            var particles = new Particles();
            particles.animate();
        }

        // animation of all objects
        /*for( var i = 0; i < scene.objects.length; i ++ ){
            scene.objects[ i ].rotation.y = PIseconds*0.0003 * (i % 2 ? 1 : -1);
            scene.objects[ i ].rotation.x = PIseconds*0.0002 * (i % 2 ? 1 : -1);
        }*/
        // animate DirectionalLight
        // scene.lights.forEach(function(light, idx){
        //     if( light instanceof THREE.DirectionalLight === false ) return;
        //     var ang = 0.0005 * PIseconds * (idx % 2 ? 1 : -1);
        //     light.position.set(Math.cos(ang), Math.sin(ang), Math.cos(ang*2)).normalize();                          
        // });
        // animate PointLights
        /*scene.lights.forEach(function(light, idx){
            if( light instanceof THREE.PointLight === false )   return;
            var angle   = 0.0005 * PIseconds * (idx % 2 ? 1 : -1) + idx * Math.PI/3;
            light.position.set(Math.cos(angle)*3, Math.sin(angle*3)*2, Math.cos(angle*2)).normalize().multiplyScalar(2);
        });*/

        // actually render the scene
        renderer.clear();
        composer.render();
    }
})();


