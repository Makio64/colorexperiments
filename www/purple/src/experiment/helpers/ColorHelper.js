define(['tinycolor'], function(tinycolor) {
    return {
        createHSLScale: function(start, end, steps) {
            start = tinycolor(start).toHsl();
            end = tinycolor(end).toHsl();

            var hueDecrease = (end.h - start.h) / steps;
            var satDecrease = (end.s - start.s) / steps;
            var lightDecrease = (end.l - start.l) / steps;

            var scale = [];
            for(var i = 0; i < steps; i++) {
                scale[i] = tinycolor({
                    h: start.h + hueDecrease * i,
                    s: start.s + satDecrease * i,
                    l: start.l + lightDecrease * i
                }).toHexString();
            }

            return scale;
        },

        createRBScale: function(start, end, steps) {
            start = tinycolor(start).toRgb();
            end = tinycolor(end).toRgb();

            var redDecrease = (end.r - start.r) / steps;
            var greenDecrease = (end.g - start.g) / steps;
            var blueDecrease = (end.b - start.b) / steps;

            var scale = [];
            for(var i = 0; i < steps; i++) {
                scale[i] = tinycolor({
                    r: start.r + redDecrease * i,
                    g: start.g + greenDecrease * i,
                    b: start.b + blueDecrease * i,
                    a: 1
                }).toHexString();
            }

            return scale;
        },

        toRGBA: function(color, opacity) {
            return tinycolor(color).toRgbString().replace('rgb', 'rgba').replace(')', ', ' + opacity + ')');
        }
    };
});