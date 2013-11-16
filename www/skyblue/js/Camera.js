var Camera = function(){
    if (typeof Camera.instance === 'object') {
        return Camera.instance;
    }

    var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(k.cameraX, k.cameraY, k.cameraZ);
    var startPos = new THREE.Vector3(0,-100,-10);
    camera.lookAt( startPos );

    //camera.controls  = new THREEx.DragPanControls(camera);


    camera.start = function(){
        var camPos = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };
        var finalePos = {
            x: 0,
            y: 150,
            z: 1,
        }

        this.tweenCameraPosition(camPos, finalePos, true);
    };

    camera.tweenCameraPosition = function(position, positionFinale, lookAtStart, easing, duration){
        var lookAtStart = lookAtStart || false;
        var easing = easing || 'Expo.easeInOut';
        var pos;
        var pointAt = new THREE.Vector3(0,0,0);
        // Position the camera to fit
        var duration = duration || 2;

        var tween = new TweenLite(position, duration, {
            x: positionFinale.x,
            y: positionFinale.y,
            z: positionFinale.z,
            ease: easing
        });
        tween.eventCallback("onUpdate", function(){
            pos = new THREE.Vector3(position.x,position.y,position.z);
            //console.log('update', pos);
            camera.position = pos;
            if(lookAtStart) camera.lookAt(startPos);
        });

    };

    camera.shake = function(nbShake, force){
        var nbShake = nbShake || 10;
        var force = force || k.particleSpeed/2;
        console.log('shake', nbShake, force);
        var originPos = camera.position;

        var delta = function(){ return -force/2+Math.random()*force; };
        
        for(var i = 1; i <= nbShake; i++){
            if( i!=nbShake ) {
                console.log('tween shake');
                new TweenMax(camera.position, 0.1,{
                    z: camera.position.z+delta(),
                    x: camera.position.x+delta(),
                    ease: Expo.easeInOut,
                    delay: i*0.1
                });
            } else {
                // reset cam to original position
                var t = new TweenMax(camera.position, 0.1, {
                    z: originPos.z,
                    x: originPos.x,
                    ease: Expo.easeInOut,
                    delay: nbShake*0.1
                });
                t.eventCallback("onComplete", function(){
                    console.log('end');
                    k.shake = false;
                });
            }
        };

        // var t2 = new TweenMax(camera.position, 0.1,{
        //     z: originPos.z,
        //     x: originPos.x,
        //     delay: (nbShake+1) * .1,
        //     ease: Expo.easeInOut
        // });
    }

    camera.fall = function(){
        /*var camPos = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };
        var finalePos = {
            x: camera.position.x,
            y: camera.position.y-700,
            z: camera.position.z
        }
        this.tweenCameraPosition(camPos, finalePos, false, 'Quad.easeIn', 12) ;*/

        var translateCamInterval = setInterval(function(){
            camera.translateZ(-1);
        },17);

        setTimeout(function(){
            clearInterval(translateCamInterval);
        },12000);
    }

    camera.goUp = function(){
        camera.translateZ(-1000);
    }

    

    Camera.instance = camera;

    return camera;
};