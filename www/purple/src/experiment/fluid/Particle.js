define(['fluid/Constants'], function(Constants) {
    var Particle = function(x, y, type) {
        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;
        this.fx = 0;
        this.fy = 0;
        this.gx = 0;
        this.gy = 0;

        this.density = 0;
        this.densityNear = 0;

        this.type = type;
        this.gravity = Constants.GRAVITY;

        switch(type) {
            case 0: // RED
                this.color = "#FF0000";
                break;
            case 1: // BLUE
                this.color = "#0000FF";
                break;
            case 2:
                this.color = "#880066";
                break;
        }
    };

    return Particle;
});