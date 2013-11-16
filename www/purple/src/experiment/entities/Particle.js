define(['entities/Vector', 'data/Colors', 'helpers/ColorHelper', 'helpers/MathHelper'], function(Vector, Colors, ColorHelper, MathHelper) {
    var Particle = function(x, y) {
        this.position = new Vector(x, y);
        this.velocity = new Vector();
        this.acceleration = new Vector();
        this.mass = 10;

        this.size = Math.random() > 0.5 ? 2 : 3;

        // this.fillStyle = Colors.PURPLE;
        this.fillStyle = Colors.PURPLES[~~(MathHelper.rand(0, Colors.PURPLES.length - 1))];

        this.opacity = 0;
    };

    Particle.prototype = {
        applyForce: function(force) {
            this.acceleration.add(force.divide(this.mass));
        },

        update: function(context) {
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);
            this.draw(context);

            this.acceleration.multiply(0);
        },

        draw: function(context) {
            // context.moveTo(this.position.x, this.position.y);
            // context.arc(this.position.x, this.position.y, 1, 0, 2 * Math.PI, true);
            // context.fill();
            context.fillStyle = ColorHelper.toRGBA(this.fillStyle, this.opacity);
            context.fillRect(this.position.x, this.position.y, this.size, this.size);
        }
    };

    return Particle;
});