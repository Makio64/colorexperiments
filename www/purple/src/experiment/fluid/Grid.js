define(function() {
    var Grid = function() {
        this.particles = [];
        this.particlesNumber = 0;
    };

    Grid.prototype = {
        add: function(particle) {
            this.particles[this.particlesNumber++] = particle;
        }
    };

    return Grid;
});