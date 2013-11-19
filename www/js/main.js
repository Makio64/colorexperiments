var Main, main,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

main = null;

Main = (function() {
  Main.prototype.dt = 0;

  Main.prototype.lastTime = 0;

  Main.prototype.pause = false;

  Main.prototype.iframe = null;

  function Main() {
    this.animate = __bind(this.animate, this);
    this.initColor = __bind(this.initColor, this);
    var color, colors, _i, _len;
    this.pause = false;
    this.lastTime = Date.now();
    window.focus();
    colors = ["pink", "yellow", "orange", "red", "green", "purple", "white", "darkblue", "skyblue", "grey"];
    for (_i = 0, _len = colors.length; _i < _len; _i++) {
      color = colors[_i];
      this.initColor(color);
    }
    return;
  }

  Main.prototype.initColor = function(color) {
    var _this = this;
    $("." + color).mouseover(function(e) {
      if (_this.iframe === null) {
        $("#" + color + " div").addClass("activate");
        return $("." + color + " div").addClass("activate");
      } else {
        $("." + color).addClass("reveal");
        return $('header').addClass("" + color);
      }
    }).mouseout(function(e) {
      $("#" + color + " div").removeClass("activate");
      $("." + color + " div").removeClass("activate");
      $("." + color).removeClass("reveal");
      return $('header').removeClass("" + color);
    }).click(function(e) {
      if (_this.iframe) {
        document.body.removeChild(_this.iframe);
        _this.iframe = null;
      } else {
        $("#" + color + " div").removeClass("activate");
        $("." + color + " div").removeClass("activate");
        $("header, h1, h2, #global").addClass("activate");
        $(".bubble, .bubble2").addClass("mini");
        $("#about").remove();
      }
      _this.iframe = document.createElement("IFRAME");
      _this.iframe.setAttribute("src", "./" + color);
      _this.iframe.style.position = "absolute";
      _this.iframe.style.bottom = 0;
      _this.iframe.style.left = 0;
      _this.iframe.style.zIndex = 100;
      _this.iframe.style.width = window.innerWidth + "px";
      _this.iframe.style.height = (window.innerHeight - 50) + "px";
      return document.body.appendChild(_this.iframe);
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
    t = Date.now();
    dt = t - this.lastTime;
    this.lastTime = t;
  };

  Main.prototype.resize = function() {
    var height, width;
    width = window.innerWidth;
    height = window.innerHeight;
    if (this.iframe) {
      this.iframe.style.width = width + "px";
      this.iframe.style.height = (height - 50) + "px";
    }
  };

  return Main;

})();

$(document).ready(function() {
  var _this = this;
  main = new Main();
  $(window).blur(function() {
    return main.pause = true;
  });
  $(window).focus(function() {
    main.lastTime = Date.now();
    return main.pause = false;
  });
  $(window).resize(function() {
    return main.resize();
  });
});
