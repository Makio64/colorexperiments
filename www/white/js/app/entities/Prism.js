define(function() {

	var Prism = function(scene) {
		this.geometry = new THREE.TetrahedronGeometry(20);
		this.materials = [
			new THREE.MeshPhongMaterial({
				color: '#111',
				transparent: true,
				opacity: 1
			}),
			new THREE.MeshBasicMaterial({
				color: '#AAA',
				transparent: true,
				opacity: 1,
				wireframe: true
			})
		];
		this.mesh = new THREE.SceneUtils.createMultiMaterialObject(this.geometry, this.materials);

		this.mesh.rotation.y = 90 * deg2rad;
		this.mesh.rotation.z = 120 * deg2rad;

		scene.add(this.mesh);
	};

	Prism.prototype = {
		update: function(rotationX, rotationY) {
			this.mesh.rotation.x = rotationX;
			this.mesh.rotation.y = rotationY;
		},

		randomRotation: function() {
			var scaleFactor = Math.random() * 1.5 + 1;
			TweenMax.to(this.mesh.scale, 0.15, {
				x: scaleFactor,
				y: scaleFactor,
				z: scaleFactor,
				ease: Bounce.easeInOut
			});
			TweenMax.to(this.mesh.rotation, 0.15, {
				x: (~~(Math.random() * 360) + 1) * deg2rad,
				y: (~~(Math.random() * 360) + 1) * deg2rad
			});
		},

		coolPosition: function(rotationY) {
			this.mesh.rotation.x = 1;
			this.mesh.rotation.y = rotationY;
		}
	};

	return Prism;
});