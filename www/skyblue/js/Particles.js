var Particles = function(){
    if (typeof Particles.instance === 'object') {
        return Particles.instance;
    }

    
    var nbParticles = 100;


    var geometry = new THREE.CylinderGeometry( 1, 0, 40, 5 );
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });

    var obj = [];
    for ( var i = 0; i < nbParticles; i ++ ) {

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = Math.random() * 400 - 200;
        mesh.position.y = Math.random() * 4400 - 4000;
        mesh.position.z = Math.random() * 400 - 200;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 4 + 2;
        scene.add( mesh );
        obj.push(mesh);
    }

    var particles = {
        obj: obj
    };

    particles.respawn = true;

    particles.animate = function(){
        var l = obj.length;
        for ( var i = 0; i < l; i ++ ) {
            if(obj[i].position.y < 100 ){
                obj[i].position.y += k.particleSpeed;
                obj[i].material.opacity = k.particleOpacity;
            } else if(particles.respawn) {
                obj[i].position.y = -1000;    
                obj[i].position.x = Math.random() * 400 - 200;
                obj[i].position.z = Math.random() * 400 - 200;
                obj[i].scale.y += 0.06;
            }
        }
    }

    particles.speedUp = function(dest,duration){
        var dest = dest || 70;
        var duration = duration || 15;

        // tween opacity
        new TweenMax(k, duration,{
            particleOpacity: 1,
            ease: Expo.quadInOut
        });
        // tween speed
        var t = new TweenMax(k, duration,{
            particleSpeed: dest,
            ease: Expo.quadInOut
        });
        t.eventCallback("onComplete", function(){
            console.log('end speedup');
        });
    }

    particles.end = function(){
        particles.respawn = false;
    }

    Particles.instance = particles;

    return particles;
};