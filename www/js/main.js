var Main, main,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

main = null;

Main = (function() {
  Main.prototype.dt = 0;

  Main.prototype.lastTime = 0;

  Main.prototype.pause = false;

  function Main() {
    this.animate = __bind(this.animate, this);
    this.pause = false;
    this.lastTime = Date.now();
    window.focus();
    requestAnimFrame(this.animate);
    return;
  }

  Main.prototype.animate = function() {
    var dt, t;
    if (this.pause) {
      t = Date.now();
      dt = t - this.lastTime;
      this.lastTime = t;
      return;
    }
    requestAnimFrame(this.animate);
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
    requestAnimFrame(main.animate);
    main.lastTime = Date.now();
    return main.pause = false;
  });
  $(window).resize(function() {
    return main.resize();
  });
});
