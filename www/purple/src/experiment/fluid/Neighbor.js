define(['fluid/Constants'], function(Constants) {
    var Neighbor = function() {
        // Liquid simulation neighbor
    };

    Neighbor.prototype = {
        setParticle: function(p1, p2) {
            this.p1 = p1;
            this.p2 = p2;

            this.dx = p1.x - p2.x;
            this.dy = p1.y - p2.y;

            this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

            this.weight = 1 - this.distance / Constants.RANGE;

            var density = this.weight * this.weight;

            p1.density += density;
            p2.density += density;

            density *= this.weight * Constants.PRESSURE_NEAR;

            p1.densityNear += density;
            p2.densityNear += density;

            var invDistance = 1 / this.distance;

            this.dx *= invDistance;
            this.dy *= invDistance;
        },

        applyForce: function() {
            var p,
                p1 = this.p1,
                p2 = this.p2;

            // if(this.p1.type != this.p2.type) {
                // p = (this.p1.density + this.p2.density - Constants.DENSITY * 1.5) * Constants.PRESSURE;
            // }
            // else {
                p = (p1.density + p2.density - Constants.DENSITY * 2) * Constants.PRESSURE;
            // }

            var pn = (p1.densityNear + p2.densityNear) * Constants.PRESSURE_NEAR;

            var pressureWeight = this.weight * (p + this.weight * pn);
            var viscosityWeight = this.weight * Constants.VISCOSITY;

            var fx = this.dx * pressureWeight;
            var fy = this.dy * pressureWeight;

            fx += (p2.vx - p1.vx) * viscosityWeight;
            fy += (p2.vy - p1.vy) * viscosityWeight;

            p1.fx += fx;
            p1.fy += fy;

            p2.fx -= fx;
            p2.fy -= fy;

            // console.log(p1.x, p1.fx);
            // console.log(p2.x, p2.fx);
        }
    };

    return Neighbor;
});