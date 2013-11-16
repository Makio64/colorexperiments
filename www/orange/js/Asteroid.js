
Asteroid = function () {

	THREE.Mesh.apply(this, arguments);
	console.log("ateroid init");
  	// this.Asteroid.position.set(-200,200,0);

    // geometrySphere.computeFaceNormals();
    // geometrySphere.computeVertexNormals();

    
    // add the sphere to the scene


    // init();

};

Asteroid.prototype = {

	constructor: Asteroid,

	increasePosition : function(speed){
		this.Asteroid.position.x += speed;
	},
	moveYourAss : function(speed){
		for(var v=0; v<this.geometrySphere.vertices.length; v++){

                variable = Math.random()*2-1;
                // Array of vector3 : 
                vX = this.geometrySphere.vertices[v].x;
                vY = this.geometrySphere.vertices[v].y;
                vZ = this.geometrySphere.vertices[v].z;

                if(vX<-15){
                    this.geometrySphere.vertices[v].x +=variable;
                }
                // if(vX > vZ && vX > vY)
                //     geometrySphere.vertices[v].x *= 1.1;
                // else if(vY > vZ && vY > vX)
                //     geometrySphere.vertices[v].y *= 1.1;
                // else
                //     geometrySphere.vertices[v].z *= 1.1;
                // geometrySphere.vertices[v].x *= 1.1;
                // geometrySphere.vertices[v].y *= 1.1;
                // geometrySphere.vertices[v].z *= 1.1;
                // geometrySphere.vertices[v].y += 1;
                // geometrySphere.vertices[v].z += 1;
                // geometrySphere.vertices[v].y += clock/10000;
                // geometrySphere.vertices[v].z += clock/10000;
            }

            this.Asteroid.geometry.verticesNeedUpdate = true;
	},
	destroy: function () {
	}

};

THREE.EventDispatcher.prototype.apply( Asteroid.prototype );