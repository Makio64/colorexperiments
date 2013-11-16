var Asteroids = function(){
    if (typeof Asteroids.instance === 'object') {
        return Asteroids.instance;
    }

    
    var asteroids_array = [];

    var asteroids = {};
    asteroids.respawn = true;

    asteroids.add = function(){
        if(asteroids.respawn) {
            var geometry = new THREE.SphereGeometry(50, 8, 6);
            var nbVertices = geometry.vertices.length;
            for(var i = 0; i < nbVertices; i++){
                geometry.vertices[i].x += -10+Math.random()*20;
                geometry.vertices[i].y += -10+Math.random()*20;
                geometry.vertices[i].z += -10+Math.random()*20;
            }
            var material =  new THREE.MeshBasicMaterial({
                //wireframe: true,
                color: 0xffffff,
                transparent: true,
                opacity: 1
            });
            var sphere = new THREE.Mesh(geometry, material);
            sphere.position.y = -3000;
            sphere.position.x = Math.random()*200-100;
            sphere.position.z = Math.random()*200-100;
            

            var xScreen = Math.ceil((window.innerWidth/2)+(sphere.position.x*2));
            var yScreen = Math.ceil((window.innerHeight/2)+(sphere.position.z*2));
            //console.log(xScreen,sphere.position.x, yScreen,sphere.position.z);
            var bd = new Bd();
            bd.pop(xScreen, yScreen);

            sphere.scale.x = sphere.scale.y = sphere.scale.z = 0.5;

            scene.add(sphere);
            asteroids_array.push(sphere);
        }
    }

    asteroids.animate = function(){
        var l = asteroids_array.length;
        for ( var i = 0; i < l; i ++ ) {
            if(asteroids_array[i] != undefined && asteroids_array[i].position.y < 100){
                asteroids_array[i].position.y += k.particleSpeed+20;
            } else {
                scene.remove(asteroids_array[i]);
                asteroids_array.splice(i,1);
            }
        }
    }

    asteroids.end = function(){
        asteroids.respawn = false;
        clearInterval(cometInterval);
    }

    asteroids.obj = asteroids_array;


    Asteroids.instance = asteroids;

    return asteroids;
};