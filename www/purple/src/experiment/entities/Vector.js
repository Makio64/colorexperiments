define(function() {
    var Vector = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };

    Vector.prototype = {
        invert: function() {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        },

        add: function(vector) {
            this.x += vector.x;
            this.y += vector.y;
            return this;
        },

        subtract: function(vector) {
            this.x -= vector.x;
            this.y -= vector.y;
            return this;
        },

        multiply: function(value) {
            this.x *= value;
            this.y *= value;
            return this;
        },

        divide: function(value) {
            this.x /= value;
            this.y /= value;
            return this;
        },

        equals: function(vector) {
            return this.x == vector.x && this.y == vector.y;
        },

        dot: function(vector) {
            return this.x * vector.x + this.y * vector.y;
        },

        length: function(value) {
            if(value === undefined) {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            }
            else {
                this.x = Math.cos(this.angle) * value;
                this.y = Math.sin(this.angle) * value;
                return this;
            }
        },

        dist: function (vector) {
            return Math.sqrt(this.distSq(vector));
        },

        distSq: function (vector) {
            var dx = vector.x - this.x;
            var dy = vector.y - this.y;
            return dx * dx + dy * dy;
        },

        cross: function(vector) {

        },

        truncate: function(max) {
            if(this.length() > max) {
                return this.length(max);
            }
            else return this;
        },

        normalize: function() {
            return this.divide(this.length());
        },

        angle: function() {
            return Math.atan2(this.y, this.x);
        },

        toArray: function(n) {
            return [this.x, this.y].slice(0, n || 2);
        },

        clone: function() {
            return new Vector(this.x, this.y);
        },

        zero: function() {
            this.x = this.y = 0;
            return this;
        },

        set: function(x, y) {
            this.x = x;
            this.y = y;
         return this;
        }
    };

    return Vector;
});