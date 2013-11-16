define(['helpers/MathHelper', 'helpers/Mouse', 'fluid/Constants', 'fluid/Grid', 'fluid/Particle', 'fluid/Neighbor'], function(MathHelper, Mouse, Constants, Grid, Particle, Neighbor) {
    var Fluid = function(width, height, number) {
        this.width = width;
        this.height = height;
        this.particlesNumber = 0;
        this.maxParticles = number;
        this.neighborsNumber = 0;

        Constants.RANGE_SQ = Constants.RANGE * Constants.RANGE;
        Constants.NUM_GRID = ~~(this.width / Constants.RANGE);
        Constants.INV_GRID_SIZE = 1 / (this.width / Constants.NUM_GRID);

        this.count = 0;
        this.particles = [];
        this.grids = [];
        this.neighbors = [];

        for(var i = 0; i < Constants.NUM_GRID; i++) {
            this.grids[i] = [];
            for(var j = 0; j < Constants.NUM_GRID; j++) {
                this.grids[i][j] = new Grid();
            }
        }

        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
    };

    Fluid.prototype = {
        update: function(context) {
            if(this.mouseDown) {
                this.pour();
            }

            this.move(context);
        },

        pour: function(x, y) {
            for(var i = -4; i <= 4; i++) {
                // this.particles[this.particlesNumber++] = new Particle(Mouse.x + i * 10, Mouse.y, 2);
                this.particles[this.particlesNumber++] = new Particle(x, y + i, 2);
                this.particles[this.particlesNumber - 1].vx = 3;
                this.particles[this.particlesNumber - 1].vy = 5;

                if(this.particlesNumber >= this.maxParticles) {
                    this.particles.shift();
                    this.particlesNumber--;
                }
            }
        },

        move: function(context) {
            this.count++;

            // Place particles in collision grids
            this.updateGrids();

            this.findNeighbors();
            this.applyForce();

            var particle;
            for(var i = 0; i < this.particlesNumber; i++) {
                particle = this.particles[i];
                this.moveParticle(particle);

                context.fillStyle = particle.color;
                context.fillRect(particle.x, particle.y, 2, 2);
                // context.fillRect(particle.x - 1, particle.y - 1, 3, 3);
            }
        },

        stopMouse: function() {
            this.mouseDown = false;
        },

        onMouseMove: function() {

        },

        onMouseDown: function(e) {
            this.mouseDown = true;
        },

        onMouseUp: function(e) {
            this.mouseDown = false;
        },

        updateGrids: function() {
            // Reset the grids
            for(var i = 0; i < Constants.NUM_GRID; i++) {
                for(var j = 0; j < Constants.NUM_GRID; j++) {
                    this.grids[i][j].particles.length = 0;
                    this.grids[i][j].particlesNumber = 0;
                }
            }

            // Set the corresponding particles to the right grid
            var p;
            for(i = 0; i < this.particlesNumber; i++) {
                p = this.particles[i];

                p.fx = 0;
                p.fy = 0;
                p.density = 0;
                p.densityNear = 0;

                // Position in grid
                p.gx = Math.min(Constants.NUM_GRID - 1, Math.max(0, ~~(p.x * Constants.INV_GRID_SIZE)));
                p.gy = Math.min(Constants.NUM_GRID - 1, Math.max(0, ~~(p.y * Constants.INV_GRID_SIZE)));

                // p.gx = Math.floor(p.x * Constants.INV_GRID_SIZE);
                // p.gy = Math.floor(p.y * Constants.INV_GRID_SIZE);

                // if(p.gx < 0){
                //     p.gx = 0;
                // }

                // if (p.gy < 0){
                //     p.gy = 0;
                // }

                // if (p.gx > Constants.NUM_GRID - 1){
                //     p.gx = Constants.NUM_GRID - 1;
                // }

                // if (p.gy > Constants.NUM_GRID - 1){
                //     p.gy = Constants.NUM_GRID - 1;
                // }

            }
        },

        findNeighbors: function() {
            var p;
            this.neighborsNumber = 0;

            for(var i = 0; i < this.particlesNumber; i++) {
                p = this.particles[i];

                // Find if the particle is next to a side
                // to chose a neighbor on the previous/next x/y line
                var xMin = p.gx !== 0;
                var xMax = p.gx != (Constants.NUM_GRID - 1);

                var yMin = p.gy !== 0;
                var yMax = p.gy != (Constants.NUM_GRID - 1);

                this.findNeighborsInGrid(p, this.grids[p.gx][p.gy]);

                if(xMin) {
                    this.findNeighborsInGrid(p, this.grids[p.gx - 1][p.gy]);
                }

                if(xMax) {
                    this.findNeighborsInGrid(p, this.grids[p.gx + 1][p.gy]);
                }

                if(yMin) {
                    this.findNeighborsInGrid(p, this.grids[p.gx][p.gy - 1]);
                }

                if(yMax) {
                    this.findNeighborsInGrid(p, this.grids[p.gx][p.gy + 1]);
                }

                if(xMin && yMin) {
                    this.findNeighborsInGrid(p, this.grids[p.gx - 1][p.gy - 1]);
                }

                if(xMin && yMax) {
                    this.findNeighborsInGrid(p, this.grids[p.gx - 1][p.gy + 1]);
                }

                if(xMax && yMin) {
                    this.findNeighborsInGrid(p, this.grids[p.gx + 1][p.gy - 1]);
                }

                if(xMax && yMax) {
                    this.findNeighborsInGrid(p, this.grids[p.gx + 1][p.gy + 1]);
                }

                this.grids[p.gx][p.gy].add(p);
            }
        },

        findNeighborsInGrid: function(particle, grid) {
            var gridParticle, distance;
            for(var i = 0; i < grid.particlesNumber; i++) {
                gridParticle = grid.particles[i];

                // distance = MathHelper.pDist(gridParticle, particle);
                distance = (particle.x - gridParticle.x) * (particle.x - gridParticle.x) +
                       (particle.y - gridParticle.y) * (particle.y - gridParticle.y);
                // console.log(distance + "<" + Constants.RANGE_SQ + " ?");
                if(distance < Constants.RANGE_SQ) {
                    if(this.neighbors.length == this.neighborsNumber) {
                        this.neighbors[this.neighborsNumber] = new Neighbor();
                    }
                    this.neighbors[this.neighborsNumber++].setParticle(particle, gridParticle);
                }
            }
        },

        applyForce: function() {
            // console.log(("applyForce", this.neighborsNumber));
            for(var i = 0; i < this.neighborsNumber; i++) {
                this.neighbors[i].applyForce();
            }
        },

        moveParticle: function(particle) {
            particle.vy += Constants.GRAVITY;

            if(particle.density > 0) {
                particle.vx += particle.fx / (particle.density * 0.9 + 0.1);
                particle.vy += particle.fy / (particle.density * 0.9 + 0.1);
            }

            particle.x += particle.vx;
            particle.y += particle.vy;

            // Check boundaries / rebound
            if(particle.x < 5) {
                particle.vx += (5 - particle.x) * 0.5 - particle.vx * 0.5;
            }
            else if(particle.x > this.width - 5) {
                particle.vx += ((this.width - 5) - particle.x) * 0.5 - particle.vx * 0.5;
            }

            if(particle.y < 5) {
                particle.vy += (5 - particle.y) * 0.5 - particle.vy * 0.5;
            }
            else if(particle.y > this.height - 5) {
                particle.vy += ((this.height - 5) - particle.y) * 0.5 - particle.vy * 0.5;
            }
        }
    };

    return Fluid;
});