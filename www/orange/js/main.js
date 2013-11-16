/*
AUDIO
*/
var soundExplosion = new Howl({
  urls: ['musics/explosion.mp3'],
  buffer: true
});

var turnCameraFinal = false;  

var soundVitalic = new Howl({
  urls: ['musics/Poison_Lips.mp3'],
  autoplay: true,
  buffer: true,
  volume: 0.8
});
cameraTurn = false;
var container, stats;
var camera, camera2, scene, renderer;
var ambientLight;
var group;
var mouseX = 0, mouseY = 0;
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
var geometrySphere, geometryFloor, geometryExplosion, whiteBallGeometry;
var asteroidRed, asteroidYellow, asteroidContainer, explosion, whiteBall;
var explosionForces= [];
var radius, segments, rings;

var pointLight, pointLightFront, pointLightYellow, pointLightYellowFront;
var clock = new THREE.Clock();

var speedAsteroRed = 0, speedCamera=0, distCamera=0, acceleration = 0.04, accelerationCamera=0.04;
var colorAmbiant;
var line;
var step0=true,step1, step2, step3;

var step3Y=1;

var tabActions = [step, step1, step2, step3, step4, step5, climaxStep, explosionStep];
var currentStep = 0;
var rotation = 0.04, rotationGoUp=0;
var camera2isReady=false;
var variationZ = 0;
var sinus=0;

var finalPointLight;
var meshShockWave;

var increaseScale=0.01;
var scaleWhiteBall = 1;
var count = 0;
var explosionForce=50;

var alreadyMoveCameraExplosion = false;
var alreadyBorderComing = false;
var alreadyBorderGoing = false;
var asteroidYellowisAlreadyGoing = false;
var alreadyExplosionPlaying= false;
var inWayToFight = false;
var explosionGoOn = false;
var offsetPointLightX = 200;
var offsetPointLightY = 200;
var offsetPointLightZ = 200;

var offsetPointLightYellowX = 202;
var offsetPointLightYellowY = -56;
var offsetPointLightYellowZ = 164;


var composer;

var elementArePositingStep5 = false;
var cameraDatas = [
{
            name:'cam1',
            left: 0,
            bottom: 0,
            width: WIDTH,
            height: HEIGHT,
            x : -100,
            y:200,
            z:380
      },
      {
            name:'cam2',
            left: 0,
            bottom: 0,
            width: WIDTH/2,
            height: HEIGHT,
            x : -220,
            y:150,
            z:300
      }
      
      
];

var cameras = [];

var rotationCamera1=0;

      
        
       $(init);

      
            
        function init(){

            TweenLite.to($(".mask"), 1, { delay:2, opacity: 0, ease:Quad.easeIn, onComplete:function(){
                  $(".mask h3").hide();    
            }});
            scene = new THREE.Scene();

            // set some camera attributes
            var VIEW_ANGLE = 45,
                ASPECT = WIDTH / HEIGHT,
                NEAR = 0.1,
                FAR = 10000;

            container = $('#container');
            renderer = new THREE.WebGLRenderer();



            for (var i =  0; i < cameraDatas.length; ++i ) {


                  var data = cameraDatas[i];
                  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

                  camera.position.x = data.x;
                  camera.position.y = data.y;
                  camera.position.z = data.z;
                  
                  
                  scene.add(camera);

                  cameras[i] = camera;

                  
            }


            camera = cameras[0];

            cameras[1].position.z = 630;
            cameras[1].position.x = -2400;
            cameras[1].position.y = 200;
            cameras[1].rotation.y = 0;


            // start the renderer
            renderer.setSize(WIDTH, HEIGHT);

            // attach the render-supplied DOM element
            container.append(renderer.domElement);



            /*********************
            LIGHTS
            *********************/

            ambientLight = new THREE.AmbientLight(0x200202);

            // create a point light
            pointLight = new THREE.PointLight(0xFFFFFF,1,3000);
            pointLight.position.x = 0;
            pointLight.position.y = 250;
            pointLight.position.z = 130;

            pointLightFront = new THREE.PointLight(0xFFFFFF,1,1000);
            pointLightFront.position.x = 0;
            pointLightFront.position.y = 250;
            pointLightFront.position.z = 130;

            // create a point light Yellow
            pointLightYellow = new THREE.PointLight(0xFFFFFF,1,3000);
            pointLightYellow.position.x = 0;
            pointLightYellow.position.y = 250;
            pointLightYellow.position.z = 130;

            // create a point light Yellow
            pointLightYellowFront = new THREE.PointLight(0xFFFFFF,1,1000);
            pointLightYellowFront.position.x = 0;
            pointLightYellowFront.position.y = 250;
            pointLightYellowFront.position.z = 130;


            directionalLight = new THREE.DirectionalLight(0x000000, 1);
            directionalLight.position.set( 1, 1, 0 );

            directionalLight2 = new THREE.DirectionalLight(0xc8c15e, 1);
            directionalLight2.position.set( -1, 1, 0 );
            
            finalPointLight = new THREE.PointLight( 0x000000, 1, 100 );
            finalPointLight.position.x = -144;
            finalPointLight.position.y = 219;
            finalPointLight.position.z = 0;

            scene.add(directionalLight);
            scene.add(directionalLight2);
            scene.add(ambientLight);
            scene.add(pointLight);
            scene.add(pointLightFront);
            scene.add(pointLightYellow);
            scene.add(pointLightYellowFront);
            
            /********************
             ShockWave
            *********************/
            
            geometryShockWave = new THREE.TorusGeometry( 100, .5 , 50 ,50);
            materialShockWave = new THREE.MeshBasicMaterial({color:'white', transparent:true, opacity:0}); 
            meshShockWave = new THREE.Mesh(geometryShockWave, materialShockWave);
            
            
            meshShockWave.position.x = -144;
            meshShockWave.position.y = 219;
            meshShockWave.position.z = 0;

            meshShockWave.rotation.x = 3.14/2;

            scene.add(meshShockWave);

            
            /*******************
             ASTEROIDS
             *******************/

            radius = 50,
            segments = 32,
            rings = 16;
            
            //____ASTERO__CONTAINER

            geometrySphereContainer =  new THREE.SphereGeometry(radius,segments,rings);
            geometrySphereContainer.dynamic = true;
            geometrySphereContainer.applyMatrix( new THREE.Matrix4().makeTranslation( 0, radius/2, 0 ) );
            
            var sphereMaterialContainer = new THREE.MeshNormalMaterial( { transparent: true, opacity: 0.5 } );

            asteroidContainer = new THREE.Mesh(geometrySphereContainer,sphereMaterialContainer);
            // add the sphere to the scene
            asteroidContainer.position.set(-200,200,0);

             for(var v=0; v<geometrySphereContainer.vertices.length; v++){

                variable = Math.random()*2-1;
                // Array of vector3 : 
                vX = geometrySphereContainer.vertices[v].x;
                vY = geometrySphereContainer.vertices[v].y;
                vZ = geometrySphereContainer.vertices[v].z;

                if(vX<0){
                    geometrySphereContainer.vertices[v].x -= geometrySphereContainer.vertices[v].x;
                }
            }

            //____ASTERO_1
            geometrySphere =  new THREE.SphereGeometry(radius,segments,rings);
            geometrySphere.dynamic = true;
            // geometrySphere.applyMatrix( new THREE.Matrix4().makeTranslation( 0, radius/2, 0 ) );
            
            var sphereMaterial = new THREE.MeshPhongMaterial({
                blending: THREE.MultiplyBlending,
                wireframe:false,
                color:'red'
            });


            asteroidRed = new THREE.Mesh(geometrySphere, sphereMaterial);
            // add the sphere to the scene
            asteroidRed.position.set(0,200,0);
            // asteroidRed.position.set(-1200,800,0);
            // asteroidContainer.add(asteroidRed);

            asteroidContainer.add(asteroidRed);
            scene.add(asteroidRed);


            //____ASTERO_2
            geometrySphere2 =  new THREE.SphereGeometry(
                radius,
                segments,
                rings);
            geometrySphere2.dynamic = true;

            geometrySphere2.applyMatrix( new THREE.Matrix4().makeTranslation( 0, radius/2, 0 ) );
            // create the sphere's material
            var sphereMaterial2 =
              new THREE.MeshPhongMaterial(
                {
                    wireframe:false,
                    color:'yellow',
                    'transparent':true,
                    opacity:0
                });

            asteroidYellow = new THREE.Mesh(geometrySphere2,
              sphereMaterial2);
            // add the sphere to the scene
            // asteroidYellow.position.set(900,200,0);
            asteroidYellow.position.set(-2400,200,200);
            scene.add(asteroidYellow);


            // ______EXPLOSION


            geometryExplosion =  new THREE.SphereGeometry(0.01,32,rings);
            geometryExplosion.dynamic = true;
            
            var sphereMaterialExplosion = new THREE.MeshPhongMaterial({
                wireframe:false,
                color:'orange'
            });

            for(var v=0; v<geometryExplosion.vertices.length; v++){           
                  randomRandomX = Math.random()*explosionForce+30;
                  variableX = Math.random()*randomRandomX-randomRandomX/2;
                  randomRandomY = Math.random()*explosionForce+30;
                  variableY = Math.random()*randomRandomY-randomRandomY/2;
                  randomRandomZ = Math.random()*explosionForce+30;
                  variableZ = Math.random()*randomRandomZ-randomRandomZ/2;

                  randomFriction = Math.random()*10;
                  

                  explosionForces[v] = Array(
                        geometryExplosion.vertices[v].normalize().x*variableX,
                        geometryExplosion.vertices[v].normalize().y*variableY,
                        geometryExplosion.vertices[v].normalize().z*variableZ,
                        randomFriction
                  );
            }


            explosion = new THREE.Mesh(geometryExplosion, sphereMaterialExplosion);
            explosion.position.set(-140,220,0);
            // scene.add(explosion);


            whiteBallGeometry =  new THREE.SphereGeometry(1,32,rings);
            
            var whiteBallMaterialExplosion = new THREE.MeshBasicMaterial({
                wireframe:false,
                color:'white',
                transparent: true
            });


            whiteBall = new THREE.Mesh(whiteBallGeometry, whiteBallMaterialExplosion);
            whiteBall.position.set(-144,224,0);
            // scene.add(whiteBall);



            /**********************
            FLOOR
            **********************/

            var size = 1000000, step = 100;
            geometryFloor = new THREE.Geometry();

            for ( var i = - size; i <= size; i += step ) {
            var alea = Math.random()*size;
                geometryFloor.vertices.push( new THREE.Vector3( - size, 0, i ) );
                geometryFloor.vertices.push( new THREE.Vector3(   size, 0, i ) );
                geometryFloor.vertices.push( new THREE.Vector3( i, 0, - size ) );
                geometryFloor.vertices.push( new THREE.Vector3( i, 0,   size ) );
            }

            var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.5 } );

            line = new THREE.Line( geometryFloor, material );
            line.type = THREE.LinePieces;
            // scene.add( line );


            var renderModel = new THREE.RenderPass( scene, camera );
            var effectBloom = new THREE.BloomPass( 1.25 );
            var effectFilm = new THREE.FilmPass( 0.35, 0.95, 2048, false );

            effectFilm.renderToScreen = true;

            composer = new THREE.EffectComposer( renderer );

            composer.addPass( renderModel );
            composer.addPass( effectBloom );
            composer.addPass( effectFilm );

            // renderer.render(scene, camera);


            // DONT FORGET TO ADD
            setTimeout(function(){
            	currentStep++;
            },3000);

            document.addEventListener( 'mousemove', onDocumentMouseMove, false );
            
            setTimeout(function(){
                  animate();      
            },2000);
            

            /***********
            DATGUI
            ***********/
            var params = {
                colorAmbient: "#ffffff",
                colorBody: "#ffffff",
                offsetX:200,
                offsetY:200,
                offsetZ:200,
                Camera2rotationX:0,
                Camera2positionX:-2400,
                Camera2positionZ:400,
                directionalLight:"#000",
                directionalLight2:"#c8c15e" 
            };
            // var gui = new dat.GUI();
            
            // gui.addColor(params, 'colorAmbient').onChange( function(value){ ambientLight.color=new THREE.Color( value ); });
            // gui.addColor(params, 'colorBody').onChange( function(value){ 
            //       $('body').css({'background-color':value}); 
            // });
            // gui.add(params, 'offsetX', -200, 500).onChange( function(value){ offsetPointLightX = value; });
            // gui.add(params, 'offsetY', -200, 500).onChange( function(value){ offsetPointLightY = value; });
            // gui.add(params, 'offsetZ', -200, 500).onChange( function(value){ offsetPointLightZ = value; });
            // gui.add(params, 'Camera2rotationX', 0, 360).onChange( function(value){ cameras[1].rotation.y = value; });
            // gui.add(params, 'Camera2positionX', -2800, -2000).onChange( function(value){ cameras[1].position.x = value; });
            // gui.add(params, 'Camera2positionZ', 100, 800).onChange( function(value){ cameras[1].position.z = value; });
            // gui.addColor(params, 'directionalLight').onChange( function(value){ 
            //       directionalLight.color=new THREE.Color( value );
            // });
            // gui.addColor(params, 'directionalLight2').onChange( function(value){ 
            //       directionalLight2.color=new THREE.Color( value );
            // });

        }
        
        function onDocumentMouseMove( event ) {
            mouseX = ( event.clientX - WIDTH/2 );
            mouseY = ( event.clientY - HEIGHT/2 );
        }

        //

        function animate() {
            requestAnimationFrame( animate );
            time = clock.getElapsedTime();
            delta = clock.getDelta();
            render();
            // stats.update();
        }


      function step(){
            // follow the red astero
            speedCamera += accelerationCamera;
            camera.position.x += speedCamera;


            // asteroid
            speedAsteroRed += acceleration;
            asteroidRed.position.x += speedAsteroRed;
            
      }

      function step1(){
            // camera increases velocity and rotate to look at the red asteroide
            accelerationCamera += 0.002;
            speedCamera += accelerationCamera;
            camera.position.x += speedCamera;
            rotationCamera1+=0.0001;
            camera.rotation.y += rotationCamera1;

            // asteroid
            speedAsteroRed += acceleration;
            asteroidRed.position.x += speedAsteroRed;

            if(rotationCamera1>0.014){
                  currentStep++;
                  rotationCamera1=0;
                  speedCamera -= 4;
            }
      }

      function step2(){
            if(speedAsteroRed > 9)
                  speedAsteroRed -= 0.2;

            if(speedCamera > 4)
                  speedCamera -= 0.8;     

            camera.position.x += speedCamera;
            
            // asteroid
            if(rotation>0.01)
                  rotation -=0.005;      
            speedAsteroRed += acceleration;
            asteroidRed.position.x += speedAsteroRed;

            if(rotationCamera1>=-0.015){
                  // camera.position.x += speedCamera;
                  rotationCamera1-=0.00005;
                  camera.rotation.y += rotationCamera1;
            } else {
                  scene.add(whiteBall);
                  scene.add(explosion);
                  currentStep++;
                  acceleration = 0.04;
                  accelerationCamera=0.04;
                  speedAsteroRed = 9;
                  speedCamera = 9;
            }
      }

      function step3(){

            // camera 1
            speedCamera += accelerationCamera;
            camera.position.x += speedCamera;
            
            sinus +=0.1;

            // camera 2 
            cameras[1].position.x -= speedCamera;
            asteroidYellow.position.x -= speedAsteroRed;
            asteroidYellow.position.y += Math.sin((sinus));
            asteroidYellow.position.z += Math.cos((sinus));
            
            // asteroid
            if(rotation<0.04)
                  rotation +=0.005;  
                      
            speedAsteroRed += acceleration;
            asteroidRed.position.x += speedAsteroRed;
            asteroidRed.rotation.x  += rotation;
            asteroidRed.position.y += Math.sin((sinus));
            asteroidRed.position.z += Math.cos((sinus));

            if(camera.position.z > asteroidRed.position.z){
                  
                  camera.position.z -= 7;

                  // camera2isReady = true;
            } else {
                  currentStep++;
            }
                
            $("body").click(function(){
                   })   

      }



      function step4(){

            camera2isReady = true;
            asteroidYellow.material.opacity =1;
            if(!alreadyBorderComing){
                  alreadyBorderComing= true;
                  TweenLite.to($(".border"), 0.3, { top: 0, ease:Quad.easeOut });
            }

            if(cameraDatas[1].left<0)
                  cameraDatas[1].left+=10;

            // camera 1
            speedCamera += accelerationCamera;
            
            sinus +=0.1;

            // camera 2 
            asteroidYellow.position.y += Math.sin((sinus));
            asteroidYellow.position.z += Math.cos((sinus));
            

            if(count>130){
                  speedAsteroRed += acceleration;
                  asteroidRed.position.y += speedCamera;

                  $("body").click(function(){
                             })

                  if(asteroidRed.position.y>1500){
                        
                        if(!alreadyBorderGoing){
                              alreadyBorderGoing= true;
                              TweenLite.to(asteroidYellow.position, 0.8, { x: -3100, ease:Quad.easeOut });
                              TweenLite.to($(".border"), 0.3, { top: '-100%', delay:0.8, ease:Quad.easeOut });

                              TweenLite.to(cameraDatas[1], 0.3, { width: WIDTH});

                              // cameraDatas[1].width= WIDTH;
                              
                        }
                        if(asteroidRed.position.y>4000){
                             
                             if(!asteroidYellowisAlreadyGoing){
                                   asteroidYellowisAlreadyGoing = true;
                                   TweenLite.to(asteroidYellow.position, 0.8, { x: -2500, ease:Quad.easeIn, onComplete:function(){
                                         currentStep++;
                                   }});
                             }
                             

                             $("body").click(function(){
                             })
                             // if()
                             // currentStep++; 
                        }
                  }
            } else {
                  count++;
                  asteroidRed.position.x += speedCamera;
                  camera.position.x += speedCamera;
                  asteroidRed.position.y += Math.sin((sinus))/1.3;
                  asteroidRed.position.z += Math.cos((sinus))/1.3;
            }
      }

      function step5(){
            camera2isReady = false;

            if(!elementArePositingStep5){
                  elementArePositingStep5=true;
                  TweenLite.to($(".mask"), 0.2, { opacity: 1, ease:Quad.easeOut, onComplete:function(){
                        
                        camera.position.set(-100, 200, 380);
                        camera.rotation.x = 0;
                        camera.rotation.z = 0;
                        camera.rotation.y = 0;
                        asteroidRed.position.set(-1200,800,0);
                        asteroidYellow.position.set(900,200,0);
                  }});  
                  
                  TweenLite.to($(".mask"), 0.2, { delay:0.2, opacity: 0, ease:Quad.easeIn, onComplete:function(){
                        currentStep++;
                  }});       
                  
                  
            }
            

            // goBlackOut();
            // currentStep++;

      }


      function goBlackOut(){
            $(".mask").fadeIn();
            camera.position.set(-100, 200, 380);
            camera.rotation.x = 0;
            camera.rotation.z = 0;
            camera.rotation.y = 0;
            asteroidRed.position.set(-1200,800,0);
            asteroidYellow.position.set(900,200,0);
            byeBlackOut();

      }

      function byeBlackOut(){
            $(".mask").fadeOut();
      }

      function climaxStep(){
            speedCamera += accelerationCamera;
            variationZ +=accelerationCamera;
            camera.position.z =2000-variationZ;
            
            // renderer.render( scene, camera2 );
            
            if(!inWayToFight){
                  inWayToFight = true;
                  TweenLite.to($('body'), 0.4, {backgroundColor: "#343434", delay:2.6, ease:Circ.easeOut});
                  TweenLite.to(asteroidRed.position, 3, {x: -210, y:230, z:0, ease:Circ.easeOut}); 
                  TweenLite.to(asteroidYellow.position, 3, {x: -110, y:200, z:0, ease:Circ.easeOut, onComplete:function(){
                        currentStep++;     
                  }}); 
            }
            // asteroid red
            speedAsteroRed += acceleration;
            // asteroidRed.position.x += speedAsteroRed;
            // asteroidRed.position.y -= speedAsteroRed/1.8;
            // asteroidRed.rotation.x  += rotation;
            asteroidRed.rotation.y  = 19;


            // asteroidYellow.position.x -= speedAsteroRed;
            // asteroidRed.rotation.x  += rotation;
            asteroidYellow.rotation.y  = 360-17;

            camera.position.z += 2;
            // asteroidRed.material =  new THREE.MeshBasicMaterial( { blending: THREE.SubtractiveBlending, color: 'red'} ) 
            // asteroidYellow.material= new THREE.MeshBasicMaterial( { blending: THREE.SubtractiveBlending, color: 'yellow'} ) 

            // if(asteroidYellow.position.x >= asteroidRed.position.x-15 && asteroidYellow.position.x <= asteroidRed.position.x+15 ){
            //       meshShockWave.material.opacity = 1;
            //       currentStep++;
            //       console.log(asteroidYellow.position);
            // }




            // asteroid yellow
            // asteroidYellow.position.x += speedAsteroRed;
            // asteroidYellow.rotation.x  += rotation;

      }

      function explosionStep(){

           // console.log(whiteBall.position)
            meshShockWave.material.opacity = 1;
            for(var v=0; v<whiteBallGeometry.vertices.length; v++){

                variable = Math.random()*2-1;
                // Array of vector3 : 
                vX = whiteBallGeometry.vertices[v].x;
                vY = whiteBallGeometry.vertices[v].y;
                vZ = whiteBallGeometry.vertices[v].z;

                if(vX<-15 || vX >15)
                  whiteBallGeometry.vertices[v].x +=variable;
                
            }

            whiteBall.geometry.verticesNeedUpdate = true;            


            explosion.geometry.verticesNeedUpdate = true;

            // console.log(meshShockWave.geometry.radius);

            increaseScale += 0.04;
            meshShockWave.scale.x += increaseScale;
            meshShockWave.scale.y += increaseScale;

            // if(meshShockWave.scale.y>5000){
            //       meshShockWave.scale.x =1;
            //       meshShockWave.scale.y =1;
            //       increaseScale = 0.01;
            //       meshShockWave.rotation.y = Math.random()*360;
            // }


            if(!alreadyMoveCameraExplosion){
                  ambientLight.color = new THREE.Color( "#e6800d" );
                 TweenLite.to(meshShockWave.scale, 0.2, {x: 2000, y:2000, z:4, ease:Quad.easeOut});
                 // TweenLite.to(directionalLight.color, 0.2, {hex: "#000", ease:Quad.easeOut}); 
                 TweenLite.to(whiteBall.scale, 0.2, {x: 1000, y:1000, z:1000, ease:Quad.easeOut});
                 TweenLite.to(whiteBall.material, 0.2, {opacity:0.3, ease:Quad.easeOut});
                 TweenLite.to(whiteBall.material, 0.2, {opacity:1, delay:0.2, ease:Quad.easeIn});
                 TweenLite.to(whiteBall.scale, 0.2, {x: 0, y:0, z:0, delay:0.2, ease:Quad.easeIn});
                 TweenLite.to(camera.position, 0.6, {z: 800, ease:Strong.easeOut});
                 alreadyMoveCameraExplosion = true; 

                 explosionGoOn = true;
                 cameraTurn = true;
            }
                  
            // var friction = 0.96;

            if(explosionGoOn)
                  if(!alreadyExplosionPlaying){
                        soundExplosion.play();
                        setTimeout(function(){
                            stopSound();
                             
                        },2000);
                        turnCameraFinal = true;
                        alreadyExplosionPlaying = true;
                        
                  }
                        

                  for(var v=0; v<geometryExplosion.vertices.length; v++){
                        
                       //  randomRandomX = Math.random()*explosionForce;
                       //  variableX = Math.random()*randomRandomX-randomRandomX/2;

                       //  randomRandomY = Math.random()*explosionForce;
                       //  variableY = Math.random()*randomRandomY-randomRandomY/2;

                       //  randomRandomZ = Math.random()*explosionForce;
                       //  variableZ = Math.random()*randomRandomZ-randomRandomZ/2;
                       //  // Array of vector3 : 
                       //  vX = geometryExplosion.vertices[v].x;
                       //  vY = geometryExplosion.vertices[v].y;
                       //  vZ = geometryExplosion.vertices[v].z;

                      
                       // geometryExplosion.vertices[v].x +=variableX;
                       // geometryExplosion.vertices[v].y +=variableY;
                       // geometryExplosion.vertices[v].z +=variableZ;
                       var friction = 1- explosionForces[v][3]/100;

                       geometryExplosion.vertices[v].x += explosionForces[v][0];
                       explosionForces[v][0] *= friction;

                       geometryExplosion.vertices[v].y += explosionForces[v][1];
                       explosionForces[v][1] *= friction;

                       geometryExplosion.vertices[v].z += explosionForces[v][2];
                       explosionForces[v][2] *= friction;

                       // geometryExplosion.vertices[v].y +=variableY;
                       // geometryExplosion.vertices[v].z +=variableZ;

                       




                      
                  }

            
            if(explosionForce>0){
                  // explosionForce -= 1.5;      
                  explosionForce *= friction;      
            }
      }


      

      function render() {

            tabActions[currentStep]();

            followRedAsteroid();
            
            

            camera = cameras[0];

            if(turnCameraFinal){
                  camera.rotation.z+=0.001;
            }

            // if(distCamera < 10)
            //     camera.position.z += distCamera;
            // else if (distCamera > 0)
            // 	camera.position.z -= distCamera;

            /* ALWAYS DONE -> */
            for(var v=0; v<geometrySphere.vertices.length; v++){

                variable = Math.random()*2-1;
                // Array of vector3 : 
                vX = geometrySphere.vertices[v].x;
                vY = geometrySphere.vertices[v].y;
                vZ = geometrySphere.vertices[v].z;

                if(vX<0){
                    geometrySphere.vertices[v].x -=variable;
                } else if (vX < -10){
                      geometrySphere.vertices[v].x +=variable;
                }
            }

            

            for(var v=0; v<geometrySphere2.vertices.length; v++){

                variable2 = Math.random()*2-1;
                // Array of vector3 : 
                vX = geometrySphere2.vertices[v].x;
                vY = geometrySphere2.vertices[v].y;
                vZ = geometrySphere2.vertices[v].z;

                if(vX< 0){
                        geometrySphere2.vertices[v].x -=variable2;
                } else if (vX < -10){
                        geometrySphere2.vertices[v].x +=variable2;
                }
            }

            if(currentStep!=6){
                  asteroidRed.rotation.x  += rotation;
                  asteroidYellow.rotation.x  += rotation;
            }


            asteroidRed.geometry.verticesNeedUpdate = true;
            asteroidYellow.geometry.verticesNeedUpdate = true;

            if(camera2isReady){
                  for ( var i = 0; i < cameraDatas.length; ++i ) {
                        
                        data = cameraDatas[i];
                        cameraActual = cameras[i];

                        var left   = Math.floor( data.left );
                        var bottom = Math.floor( HEIGHT * data.bottom );
                        var width  = Math.floor( data.width );
                        var height = Math.floor( data.height );
                        renderer.setViewport( left, bottom, width, height );
                        renderer.setScissor( left, bottom, width, height );
                        renderer.enableScissorTest ( true );

                        cameraActual.aspect = width / height;
                        cameraActual.updateProjectionMatrix();

                        // TweenLite.to(vertex, duration, {x: , y: , delay:, onUpdate:, onComplete:, ease:Quad.easeOut});
                       
                        // cameraActual.rotation.x = 0;      
                        // cameraActual.rotation.y = -1.271449999999994;      
                        // cameraActual.rotation.z = 0; 
                        

                        renderer.render( scene, cameras[i] );
                        // composer.render( 0.01 )
                  }
            } else {
                  renderer.setViewport( 0, 0, WIDTH, HEIGHT );
                  renderer.setScissor( 0, 0, WIDTH, HEIGHT );
                  renderer.render( scene, cameras[0] ); 

                  // renderer.clear();
                  // composer.render( 0.01 );
                       
            }
            

      }

      function stopSound(){
            soundVitalic.fadeOut(0,8000);
            
            $(".mask h3").html("ORANGE IS BETTER");
            TweenLite.to($(".mask"), 1, { delay:6, opacity: 1, backgroundColor:"#e87a2d", ease:Quad.easeIn, onComplete:function(){
                  $(".mask h3").fadeIn(800);
                  TweenLite.to($(".mask h3"), 0.6, {opacity: 1, color:"#000", ease:Quad.easeIn}); 
            }});  
            // console.log("stopSound");
      }

      function followRedAsteroid(){
            pointLight.position.x = asteroidRed.position.x- offsetPointLightX;
            pointLight.position.y = asteroidRed.position.y - offsetPointLightY;
            pointLight.position.z = asteroidRed.position.z- offsetPointLightZ; 

            pointLightFront.position.x = asteroidRed.position.x + offsetPointLightX *2;
            pointLightFront.position.y = asteroidRed.position.y + offsetPointLightY *2;
            pointLightFront.position.z = asteroidRed.position.z + offsetPointLightZ *2; 

            pointLightYellow.position.x = asteroidYellow.position.x- offsetPointLightYellowX;
            pointLightYellow.position.y = asteroidYellow.position.y - offsetPointLightYellowY;
            pointLightYellow.position.z = asteroidYellow.position.z- offsetPointLightYellowZ; 

            pointLightYellowFront.position.x = asteroidYellow.position.x+ offsetPointLightYellowX*2;
            pointLightYellowFront.position.y = asteroidYellow.position.y + offsetPointLightYellowY*2;
            pointLightYellowFront.position.z = asteroidYellow.position.z + offsetPointLightYellowZ*2; 
      }
