define(function() {
    return {
        rand: function(min, max) {
            return Math.random() * (max - min) + min;
        },

        dist: function(x1, y1, x2, y2) {
            return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
        },

        pDist: function(p1, p2) {
            return this.dist(p1.x, p1.y, p2.x, p2.y);
        },

        radToDeg: function(radians) {
            return radians / (Math.PI / 180);
        },

        degToRad: function(degrees) {
            return degrees * (Math.PI / 180);
        },

        hypotenuse: function(a, b) {
            return Math.sqrt(a * a + b * b);
        },

        angle: function(x1, y1, x2, y2) {
            var dx = x2 - x1,
            dy = y2 - y1;
            return dx < 0 ? Math.atan(dy / dx) : Math.PI + Math.atan(dy / dx);
        },

        pAngle: function(p1, p2) {
            return this.angle(p1.x, p1.y, p2.x, p2.y);
        },

    };
});