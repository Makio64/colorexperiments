define(function() {

	// LIGHTS.SpotGeometry
	var IncidentRay = function(scene) {
		var texture = THREE.ImageUtils.loadTexture("img/spotLine.png");
		this.geometry = new THREE.PlaneGeometry(1, 1000, 1, 100);

		this.material = new THREE.MeshBasicMaterial({
			color: 0xFFFFFF,
			map: texture,
			transparent: true,
			alphaTest: 0.5,
			side: THREE.DoubleSide
		});

		this.blend();
		this.randomVertices();

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(0, 0, 2500);
		this.mesh.rotation.x = 90 * deg2rad;

		scene.add(this.mesh);
	};

	IncidentRay.prototype = {
		update: function(radius) {
			var angle = 0;
			//var radius = 0.3;
			for (var i = this.geometry.vertices.length - 1; i >= 0; i--) {
				var vertex = this.geometry.vertices[i];
				angle += 0.1;
				vertex.x = Math.cos(angle) * radius - radius / 2 + vertex.randomOffset;
				if (i%2 === 0) {
					vertex.x += radius;
				}
				this.geometry.verticesNeedUpdate = true;
			}
		},

		position: function (position) {
			this.mesh.position.z = position + 300;
		},

		randomVertices: function () {
			for (var i = this.geometry.vertices.length - 1; i >= 0; i--) {
				this.geometry.vertices[i].randomOffset = Math.random() < 0.5 ? -0.3 : 0.3;
			}
		},

		blend: function () {
			this.material.blending = THREE["CustomBlending"];
			this.material.blendSrc = THREE["OneFactor"];
			this.material.blendDst = THREE["SrcAlphaFactor"];
			this.material.blendEquation = THREE.AddEquation;
		}
	};

	return IncidentRay;
});