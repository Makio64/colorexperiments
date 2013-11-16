define(['helpers/MathHelper', 'helpers/Resize'], function(MathHelper, Resize) {
    var TvScreen = function(angleX, angleY, step) {
        this.angleX = angleX || 0;
        this.angleY = angleY || 0;
        this.step = step || 8;
        this.opacity = 0;
    };

    TvScreen.prototype = {
        update: function(context) {
            for(var j = 0; j < Resize.screenHeight; j+=this.step) {
                for(var i = 0; i < Resize.screenWidth; i+=this.step) {
                    // var color = ~~((MathHelper.rand(100, 255)));
                    // var color = ~~(Math.cos(this.angleX * i * 0.2) * Math.sin(this.angleY * j * 2) * 255);
                    // var color = ~~(Math.cos(this.angleX * i * 2) * Math.sin(this.angleY) * 255);
                    var color = ~~(Math.cos(Math.sin(this.angleX * i * j)) * MathHelper.rand(200, 255) * Math.sin(Math.cos(this.angleY * Math.tan(0.2))));
                    // var color = ~~(Math.cos(Math.sin(this.angleX * i * j)) * 255);// * Math.sin(Math.cos(this.angleY * Math.tan(0.2))));

                    context.fillStyle = "rgba(" + color + ", " + color + ", " + color + ", " + this.opacity + ")";
                    context.fillRect(i * Math.cos(this.angleX * i * 0.2), j, this.step, this.step * 0.25);
                    this.angleX += 0.03;
                    this.angleY += 0.07;
                }
            }

            this.drawScalines(context);

        },

        drawScalines: function(context) {
            context.fillStyle = "#121212";
            for(var i = 0; i < Resize.screenHeight; i+= this.step) {
                context.fillRect(0, i, Resize.screenWidth, this.step/2);
            }
        }
    };

    return TvScreen;
});