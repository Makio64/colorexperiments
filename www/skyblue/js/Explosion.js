var Explosion = function(){
    if (typeof Explosion.instance === 'object') {
        return Explosion.instance;
    }
    

    var explosion = {};

    explosion.rays = [];
    explosion.nbRays = 1000;

    explosion.add = function(){
    	this.group = new THREE.Object3D();

    	for (var i = 0; i < this.nbRays; i++) {
	            
	        var geometry = new THREE.Geometry();
	        
	        var vertex = new THREE.Vector3( Math.random() * 2 - 1, Math.random(), Math.random() * 2 - 1 );
	        vertex.normalize();

	        vertex.multiplyScalar( 40 );
	        
	        geometry.vertices.push( vertex );
	        
	        var vertex2 = vertex.clone();
	        vertex2.multiplyScalar( Math.random() * 0.3 + 1 );
	        
	        geometry.vertices.push( vertex2 );

	        line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: Math.random() } ) );
	        this.rays.push(line);
	        
	        this.group.add( line );
	    }

	    //position on the floor
        this.group.translateY(-5200);
        scene.add(this.group);

        // this.mask = new THREE.Mesh(new THREE.CircleGeometry(70, 100, 10, 10), new THREE.MeshBasicMaterial({
        // 	color: 0xffffff,
        // 	fog: true
        // }));
        // this.mask.position = new THREE.Vector3(0,-1900,0);
        // this.mask.rotation.x = -Math.PI*.5
        // scene.add(this.mask);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            fog: false,
            transparent: true,
            opacity: 1
        });
        this.plane = new THREE.Mesh(new THREE.CircleGeometry(70, 100, 10, 10), this.material);
        this.plane.position = new THREE.Vector3(0,-5150,0);
        this.plane.rotation.x = -Math.PI*.5
        scene.add(this.plane);
    };

    

    explosion.explode = function(){
    	var speed = 0.3;

        this.group.position.y = -2000;
        this.plane.position.y = -1950;

    	var c = new Camera();
        c.shake(10, 100);
    	/*for (var i = 0; i < this.nbRays; i++) {
            this.rays[i].scale.x = this.rays[i].scale.y = this.rays[i].scale.z += speed;
        }*/
        var t1 = new TweenMax(this.group.scale, speed, {
        	x: 15,
        	y: 15,
        	z: 15,
        	ease: Expo.easeOut
        });
        t1.eventCallback("onComplete", function(){
        	scene.remove(explosion.group);
        });

        //this.group.scale.x = this.group.scale.y = this.group.scale.z += speed;
        this.plane.position.y += 500;
        new TweenMax(this.plane.scale, speed+0.1, {
        	x: 20,
        	y: 20,
        	z: 20,
        	ease: Quad.easeOut,
        	delay: speed-0.1
        });

        var self = this;
        setTimeout(function(){
            new TweenMax(self.material, 1.5, {
                opacity: 0
            });
            var bd = new Bd();
            bd.pop(window.innerWidth/2, window.innerHeight/2, 4, 300, 1000, true);
        },1000);

        //this.group.rotation.y += 0.006;
        

    };

    Explosion.instance = explosion;

    return explosion;
};