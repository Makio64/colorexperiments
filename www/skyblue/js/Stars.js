var Stars = function(){
    if (typeof Stars.instance === 'object') {
        return Stars.instance;
    }

    var geometry = new THREE.Geometry();

    var stars = {};

    stars.add = function(){
    	for ( i = 0; i < 10000; i ++ ) {
        
	        var vertex = new THREE.Vector3();
	        vertex.x = Math.random() * 200 - 100;
	        vertex.y = Math.random() * 200 - 100;
	        vertex.z = Math.random() * 200 - 100;

	        vertex.multiplyScalar( 10 );
	        
	        geometry.vertices.push( vertex );
	    }
	    
	    
	    var material = new THREE.ParticleBasicMaterial({
	    	size: 7
	    });
	    
	    this.obj = new THREE.ParticleSystem(geometry, material);
	    //this.obj.translateY(-300);
	    
	    scene.add(this.obj);
    }

    stars.animate = function(){
    	this.obj.rotation.y -= 0.00005;
        this.obj.rotation.x -= 0.00005;
    }

    stars.remove = function(){
    	scene.remove(this.obj);
    }
    

    Stars.instance = stars;

    return stars;
};