var CellConstant = (function () {
	function CellConstant() {}
	CellConstant.radius = 100;
	CellConstant.color = 0x546831;
	CellConstant.segment = 30;
	CellConstant.rings = 30;
	CellConstant.cellChildCount = 4; 
	CellConstant.multiplyDuration = 2.57;// hard paste from forest temple sound
	CellConstant.multiplyTimer = CellConstant.multiplyDuration*1000;
	CellConstant.cellSpikes = 60;
	CellConstant.mainCellSpikeRange = 1.5;
	CellConstant.generationMax = 20;
	return CellConstant;
})();

var Cell = function (geometry, material) {
	THREE.Mesh.call( this );	
	this.geometry = geometry !== undefined ? geometry : new THREE.SphereGeometry( CellConstant.radius, CellConstant.segment, CellConstant.rings);
	this.material = material !== undefined ? material : CONFIG.mesh.material;
	this.childrens = [];
	this.multiplyDuration = 2;
	this.spikesUsed = [];
}

Cell.prototype = Object.create(THREE.Mesh.prototype);

Cell.prototype.selectRandomPoint = function(scope) {
	var validIndex = false;
	var indexToUse; 
	while(validIndex == false){

		var index = Math.floor(this.geometry.vertices.length*Math.random());
		if(this.spikesUsed.length == 0) {
			this.spikesUsed.push(index);
			validIndex = true; 
		}
		if(this.spikesUsed.indexOf(index) == -1) {
			indexToUse = index;
			this.spikesUsed.push(index);
			validIndex = true;
		}
	}
	return this.geometry.vertices[index];
};

Cell.prototype.selectInversePoint = function (point) {
	// clone the current point 
	point = point.clone();
	// return inverse point
	return point.set(-point.x, -point.y, -point.z)

}
Cell.prototype.selectVertexByPoint = function(point, mesh) {
	var geometry = mesh.geometry;
	var distMax = Number.MAX_VALUE;
	var vertex = null;
	// select a vertex from a mesh in his geometry
	for (var i = 0; i < geometry.vertices.length; i++) {
		var v = geometry.vertices[i];
		if(point.x == v.x && point.y == v.y && point.z == v.z){
			return v;
		}else{
			var dist = v.distanceTo(point);
			if(dist < distMax){
				vertex = v;
			}
		}
	};
	return vertex;
	
};

Cell.prototype.multiply = function (gen) {
	var scope = this;
	var cellCount = 1;

	// create only one cell for gen 0
	if(this.generation == 0) cellCount = CellConstant.cellChildCount;
	if(this.generation !=0 ) scope.setAsVirus();

	for (var i = 0; i < cellCount; i++) {
		this.addChild();
	}
	if(this.generation < CellConstant.generationMax){ 
		setTimeout(function () {
			scope.multiplyChildrens();
		}, CellConstant.multiplyTimer)
	}else{
		if (this.generation == CellConstant.generationMax) scope.setAsVirus();
		console.log('[STOP MULTIPLY CHILDRENS]')
	}
}

Cell.prototype.setAsVirus = function() {
	var self = this;
	for (var i = 0; i < CellConstant.cellSpikes; i++) {

		var vertexSpike = this.selectRandomPoint(this);

		TweenLite.to(
			vertexSpike, 
			this.multiplyDuration, 
			{x: vertexSpike.x * CellConstant.mainCellSpikeRange, y: vertexSpike.y * CellConstant.mainCellSpikeRange, z: vertexSpike.z * CellConstant.mainCellSpikeRange, 
				ease: Expo.easeIn,
				onUpdate: function () {
				self.geometry.verticesNeedUpdate = true;

			}
		});
	};
};

Cell.prototype.addChild = function() {
	var scope = this;
	var scaleRange = 10;

	var aCell = new Cell();

	aCell.generation = scope.generation + 1;
	aCell.position.set(this.position.x, this.position.y, this.position.z);

	var vertex = this.selectRandomPoint(scope);

	var vInversed = aCell.selectInversePoint(vertex);
	
	var vInverse = aCell.selectVertexByPoint(vertex, aCell);

	aCell.scale.set(0.001, 0.001, 0.001);

	TweenLite.to(
		aCell.position, 
		scope.multiplyDuration, 
		{x: this.position.x + vertex.x * scaleRange, y: this.position.y + vertex.y * scaleRange, z: this.position.z + vertex.z * scaleRange});

	var scale = Math.random() * (1.5 - 0.5) + 0.5;
	// random size
	TweenLite.to(
		aCell.scale, 
		scope.multiplyDuration, 
		{x: 1, y: 1, z: 1});

	TweenLite.to(
		vertex, 
		scope.multiplyDuration, 
		{x: vInverse.x + vertex.x * scaleRange, y: vInverse.y + vertex.y * scaleRange, z: vInverse.z + vertex.z * scaleRange, 
			onUpdate: function () {
				scope.geometry.verticesNeedUpdate = true;
				aCell.geometry.verticesNeedUpdate = true;
			}
		});

	// for our created cell, it pull one of his vertex to the origin point
	TweenLite.to(
		vInverse, 
		this.multiplyDuration, 
		{x: vInverse.x * -scaleRange, y: vInverse.y * -scaleRange, z: vInverse.z * -scaleRange});

	scope.childrens.push(aCell);
	scope.parent.add(aCell);
};

Cell.prototype.multiplyChildrens = function(gen) {
	for (var i = 0; i < this.childrens.length; i++) {
		var child = this.childrens[i];
		if(child.generation > 0) this.childrens[i].multiply();
	}
	this.childrens = []

};