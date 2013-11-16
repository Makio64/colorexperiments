define([], function() {

    var Resize = function() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.halfScreenWidth = this.screenWidth >> 1;
        this.halfScreenHeight = this.screenHeight >> 1;

        // A list of elements to resize
        this.resizables = [];

        // window.addEventListener('resize', this.onResize.bind(this));
    };

    Resize.prototype = {
        enableSmoothing: function(context, value) {
            a = value || false;

            context.webkitImageSmoothingEnabled = value;
            context.mozImageSmoothingEnabled = value;
            context.imageSmoothingEnabled = value;
        },

        onResize: function() {
            this.screenWidth = window.innerWidth;
            this.screenHeight = window.innerHeight;
            this.halfScreenWidth = this.screenWidth >> 1;
            this.halfScreenHeight = this.screenHeight >> 1;

            // Resize supplied elements
            // for(var i = 0; i < this.resizables.length; i++) {
            //     this.resizables[i].width = this.screenWidth;
            //     this.resizables[i].height = this.screenHeight;
            // }
        }
    };

    var ResizeSingleton = new Resize();

    return ResizeSingleton;
});