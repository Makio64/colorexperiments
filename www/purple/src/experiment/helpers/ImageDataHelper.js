define(function() {
    var ImageDataHelper = {
        getImageData: function(context, x, y, width, height) {
            return context.getImageData(x, y, width, height);
        },

        getPixel: function(imageData, x, y) {
            return imageData.data[(x + y * imageData.width) * 4];
        },

        // getLastPixel: function(imageData, x, y, width, height) {
        //     return imageData.data[(x + width )]
        // },

        setPixel: function(imageData, x, y, r, g, b, a) {
            var index = (x + y * imageData.width) * 4;
            imageData.data[index+0] = r;
            imageData.data[index+1] = g;
            imageData.data[index+2] = b;
            imageData.data[index+3] = a;
        },

        canvasToImage: function(canvas) {
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            return image;
        }
    };

    return ImageDataHelper;
});