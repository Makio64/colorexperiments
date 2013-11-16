define(['entities/Vector', 'entities/Attractor', 'entities/Particle', 'helpers/MathHelper', 'data/Colors', 'TweenMax', 'helpers/ColorHelper', 'data/GlobalSignals', 'data/GuiConstants'], function(Vector, Attractor, Particle, MathHelper, Colors, greensock, ColorHelper, GlobalSignals, GuiConstants) {
    var LetterPoint = function(x, y, particlesNumber, id) {
        this.position = new Vector(x, y);
        this.particlesNumber = particlesNumber;
        this.particles = [];

        this.lineColor = Colors.WHITE;
        this.opacity = 0;

        this.morphing = false;
        this.particleDistance = 10;
        this.angles = [];

        // Apparition timeline
        var pointsTl = new TimelineMax({onComplete: function() {
                // console.log('particlesAppeared');
                GlobalSignals.particlesAppeared.dispatch();
            }
        });

        GlobalSignals.experimentStarted.add(function() {
            pointsTl.play();
        });

        // this.showing = false;
        // this.showing = true;
        this.showing = Math.random() > 0.6;

        // Particles init
        for(var i = 0; i < this.particlesNumber; i++) {
            this.particles.push(new Particle(MathHelper.rand(x - this.particleDistance, x + this.particleDistance), MathHelper.rand(y - this.particleDistance, y + this.particleDistance)));
            pointsTl.insert(TweenMax.to(this.particles[i], 0.6, {opacity: 1, ease: Expo.easeInOut}), id * 0.5 + i * 0.6);
            this.angles.push(Math.random());
        }

        this.attractor = new Attractor(x, y);
        this.attractor.mass = 1;

        if(GuiConstants.debug) pointsTl.timeScale(GuiConstants.timeScale);
        pointsTl.gotoAndStop(0);
        // pointsTl.play();
    };

    LetterPoint.prototype = {
        update: function(context) {
            for(var i = 0; i < this.particlesNumber; i++) {

                if(this.morphing) {
                    this.smoothMoveParticle(this.particles[i], i);
                }
                else {
                    this.particles[i].applyForce(this.attractor.attract(this.particles[i]));
                }
                if(i < this.particlesNumber - 1) {
                    if(this.showing) {
                        this.drawLines(context, this.particles[i], this.particles[i+1], 15);
                    }
                }
                this.particles[i].update(context);
                this.angles[i] += 0.03;
            }

            if(GuiConstants.drawAttractor) this.draw(context);
            // this.attractor.draw(context);
        },

        smoothMoveParticle: function(particle, i) {
            var position = this.position.clone();
            particle.position.x = position.x + 20 * Math.cos(this.angles[i]);
            particle.position.y = position.y + 20 * Math.sin(this.angles[i]);
            this.attractor.position = position;
        },

        draw: function(context) {
            context.fillStyle = "rgba(120, 120, 255, 0.2)";
            context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI, true);
            context.fill();
        },

        dispose: function() {
            console.log("removing this");
            this.lineColor = "#FF0F0F";
        },

        drawLines: function(context, p1, p2, threshold) {
            var dist;
            for(var i = 0; i < this.particlesNumber; i++) {
                dist = MathHelper.pDist(p1.position, p2.position);
                if(dist <= threshold) {
                    context.beginPath();
                    // context.strokeStyle = 'rgba(255, 255, 255, ' + (1 - dist / threshold) +')';
                    context.strokeStyle = ColorHelper.toRGBA(this.lineColor, this.opacity);
                    context.moveTo(p1.position.x, p1.position.y);
                    context.lineTo(p2.position.x, p2.position.y);
                    context.stroke();
                    context.closePath();
                }
            }
        }
    };

    return LetterPoint;
});