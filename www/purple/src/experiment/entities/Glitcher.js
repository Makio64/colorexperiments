define(['helpers/ImageDataHelper', 'helpers/MathHelper'], function(ImageDataHelper, MathHelper) {
    var Glitcher = function(context, x, y, width, height) {
        this.image = ImageDataHelper.getImageData(context, x, y, width, height);
    };

    Glitcher.prototype = {
        updateImage: function(context, x, y, width, height) {
            this.image = ImageDataHelper.getImageData(context, x, y, width, height);
        },

        colorChannel: function(context, image) {
            var x = image.x,
                y = image.y,
                width = image.width,//MathHelper.rand(1, image.width >> 1),
                height = MathHelper.rand(1, image.height >> 2),
                newX = image.x, //MathHelper.rand(1, image.width),
                newY = MathHelper.rand(1, image.height);

            // console.log(x, y, width, height);
            // récupérer le morceau d'image x,y->width/height
            // var startIndex = ImageDataHelper.getPixel(this.image, x, y);
            // var imageData = imageData || context.getImageData(x, y, width, height);
            var imageData = this.image;
            var pixels = imageData.data;
            var numPixels = imageData.width * imageData.height;

            // récupérer une seule couche alpha et l'appliquer
            var colorChannel = ~~(MathHelper.rand(0, 3));

            for(var i = 0; i < numPixels; i++) {
                pixels[i * 4 + colorChannel] = 255;
            }

            /*var r, g, b, index;
            for(var j = 0; j < image.height;j ++) {
                for(var i = 0; i < image.width; i++) {
                    index = (i + j * image.width) * 4 + colorChannel;
                    r = imageData.data[index] >> 1;
                    g = imageData.data[index + 1] >> 1;
                    b = imageData.data[index + 2] >> 1;

                    imageData.data[index] = r;
                    imageData.data[index + 1] = g;
                    imageData.data[index + 2] = b;
                }
            }*/

            // context.fillStyle = "rgb(" + r + ", " + g +", " + b + ")";
            // context.fillRect(0, 0, 200, 200);

            // context.putImageData(imageData, - width + newX, newY);
            context.putImageData(imageData, newX, newY);

            // return {
            //     data: imageData,
            //     x: newX,
            //     y: newY
            // };

            // for (var j = 0; j < imageData.height; i++)
            // {
            //     for (var i = 0; i < imageData.width; j++)
            //     {
            //         var index = (i * 4) * imageData.width + (j * 4);
            //         imageData.data[index + colorChannel] = 255;
            //         imageData.data[index + 3] = Math.random();
            //     }
            // }
            // le copier sur le context
        },

        glitchFromData: function(context, x, y, data, delta, colorChannel) {
            var newX = MathHelper.rand(x - delta, x + delta),
                newY = MathHelper.rand(y - delta, y + delta),
                imageData = data,
                pixels = imageData.data,
                numPixels = imageData.width * imageData.height;

            // récupérer une seule couche alpha et l'appliquer
            colorChannel = colorChannel || ~~(MathHelper.rand(0, 3));

            for(var i = 0; i < numPixels; i++) {
                // pixels[i * 4] = 0;
                // pixels[i * 4 + 1] = 0;
                // pixels[i * 4 + 2] = 0;
                // pixels[i * 4 + 3] = 255;
                if(colorChannel == 4) {
                    pixels[i * 4] = 255;
                    pixels[i * 4 + 1] = 255;
                    pixels[i * 4 + 2] = 255;
                }
                else {
                    pixels[i * 4 + colorChannel] = 255;
                }
                // pixels[i * 4 + colorChannel] = 255;
                // if(pixels[i * 4] === 0 && pixels[i * 4 + 1] === 0 && pixels[i * 4 + 2] === 0) {
                    // pixels[i * 4 + 3] = 0;
                // }
            }

            // context.putImageData(imageData, newX, newY);
            context.putImageData(imageData, x, newY);
        },

        glitch: function(context, x, y, width, height, delta) {
            // var newX = MathHelper.rand(-width >> 1, width >> 1),
                // newY = MathHelper.rand(-height >> 1, height >> 1),
            var newX = MathHelper.rand(x - delta, x + delta),
                newY = MathHelper.rand(y - delta, y + delta),
                imageData = this.image,
                pixels = imageData.data,
                numPixels = imageData.width * imageData.height;

            // récupérer une seule couche alpha et l'appliquer
            var colorChannel = ~~(MathHelper.rand(0, 4));

            for(var i = 0; i < numPixels; i++) {
                // pixels[i * 4] = 0;
                // pixels[i * 4 + 1] = 0;
                // pixels[i * 4 + 2] = 0;
                // pixels[i * 4 + 3] = 255;
                if(colorChannel == 4) {
                    pixels[i * 4] = 255;
                    pixels[i * 4 + 1] = 255;
                    pixels[i * 4 + 2] = 255;
                }
                else {
                    pixels[i * 4 + colorChannel] = 255;
                }
                // pixels[i * 4 + colorChannel] = 255;
                // if(pixels[i * 4] === 0 && pixels[i * 4 + 1] === 0 && pixels[i * 4 + 2] === 0) {
                    // pixels[i * 4 + 3] = 0;
                // }
            }

            context.putImageData(imageData, newX, newY);

            // return {
            //     data: imageData,
            //     x: x,
            //     y: newY
            // };
        }
    };

    return Glitcher;
});