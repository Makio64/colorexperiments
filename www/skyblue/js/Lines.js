var Lines = function(){
    if (typeof Lines.instance === 'object') {
        return Lines.instance;
    }

    var lines = {};
    lines.respawn = true;

    var lines_array = [];
    var nbLines = 6;
    var radius = 200;
    var group = new THREE.Object3D();
    for(var i = 0; i < nbLines; i++){
        var material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            fog: true,
            linewidth: 2
        });
        var geometry = new THREE.Geometry();
        var x = Math.cos(i*(2*Math.PI)/nbLines)*radius;
        var z = Math.sin(i*(2*Math.PI)/nbLines)*radius;
        geometry.vertices.push(new THREE.Vector3(x, 100, z));
        geometry.vertices.push(new THREE.Vector3(x, -10000, z));
        var line = new THREE.Line(geometry, material);
        group.add(line);
        lines_array.push(line);
    }
    scene.add(group);

    lines.animate = function(){
        setInterval(function(){
            if(lines.respawn){
                var nbLines = Math.ceil(Math.random()*3);
                for(var i = 0; i< nbLines; i++){
                    (function(){
                        var lineNumber = Math.ceil(Math.random()*5);
                        lines_array[lineNumber].material.opacity = 1;
                        setTimeout(function(){
                            lines_array[lineNumber].material.opacity = 0;
                        },40);
                    })();
                }
                group.rotation.y += -1+Math.random()*2;
            }
        },200);
    }

    lines.end = function(){
        lines.respawn = false;
    }

    Lines.instance = lines;

    return lines;
};