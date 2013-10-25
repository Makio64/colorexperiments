var Main, main,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

main = null;

Main = (function() {
  Main.prototype.dt = 0;

  Main.prototype.lastTime = 0;

  Main.prototype.pause = false;

  function Main() {
    this.animate = __bind(this.animate, this);
    var color, colors, _i, _len;
    this.pause = false;
    this.lastTime = Date.now();
    window.focus();
    requestAnimationFrame(this.animate);
    colors = ["pink", "yellow", "orange", "red", "green", "purple", "white", "darkblue", "skyblue", "grey"];
    for (_i = 0, _len = colors.length; _i < _len; _i++) {
      color = colors[_i];
      this.initColor(color);
    }
    return;
  }

  Main.prototype.initColor = function(color) {
    return $("." + color).mouseover(function(e) {
      console.log(color);
      $("#" + color + " div").addClass("activate");
      return $("." + color + " div").addClass("activate");
    }).mouseout(function(e) {
      $("#" + color + " div").removeClass("activate");
      return $("." + color + " div").removeClass("activate");
    });
  };

  Main.prototype.animate = function() {
    var dt, t;
    if (this.pause) {
      t = Date.now();
      dt = t - this.lastTime;
      this.lastTime = t;
      return;
    }
    requestAnimationFrame(this.animate);
    t = Date.now();
    dt = t - this.lastTime;
    this.lastTime = t;
  };

  Main.prototype.resize = function() {
    var height, width;
    width = window.innerWidth;
    height = window.innerHeight;
  };

  return Main;

})();

$(document).ready(function() {
  var _this = this;
  main = new Main();
  $(window).blur(function() {
    main.pause = true;
    return cancelAnimationFrame(main.animate);
  });
  $(window).focus(function() {
    requestAnimationFrame(main.animate);
    main.lastTime = Date.now();
    return main.pause = false;
  });
  $(window).resize(function() {
    return main.resize();
  });
});
