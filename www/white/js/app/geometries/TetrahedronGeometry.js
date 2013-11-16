define(['app/app', 'THREE', 'app/geometries/PolyhedronGeometry'], function() {

	var TetrahedronGeometry = function(radius, detail) {
		this.createGeometry(radius, detail);
	};

	TetrahedronGeometry.prototype = {
		createGeometry: function(radius, detail) {

			var vertices = [
				[1, 1, 1],
				[-1, -1, 1],
				[-1, 1, -1],
				[1, -1, -1]
			];

			var faces = [
				[2, 1, 0],
				[0, 3, 2],
				[1, 3, 0],
				[2, 3, 1]
			];

			THREE.PolyhedronGeometry.call(this, vertices, faces, radius, detail);

			THREE.TetrahedronGeometry.prototype = Object.create(THREE.Geometry.prototype);
		}
	};

	return TetrahedronGeometry;
});