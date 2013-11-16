window.appEvents = null;

var GreenSockAMDPath = "greensock";

require.config({
  paths: {
    jquery          : './../bower_components/jquery/jquery',
    signals         : './../bower_components/js-signals/dist/signals.min',  
    TweenMax        : './../bower_components/greensock-js/src/minified/TweenMax.min',
    TimelineMax     : './../bower_components/greensock-js/src/minified/TimelineMax.min',
    'soundmanager2' : './../bower_components/soundmanager/script/soundmanager2-nodebug-jsmin',
    cs              : './../bower_components/require-cs/cs',
    'coffee-script' : './../bower_components/coffee-script/index',
  },
  shim: {
    'TweenMax': {
      exports: 'TweenMax'
    },
    'soundmanager2': {
      exports: 'soundManager'
    }
  },

  exclude     : ['coffee-script'],
  stubModules : ['cs'],
  waitSeconds: 5
});

require(["soundmanager2"], function(soundManager) {
  soundManager.setup({
    url: "/swf/",
    preferFlash: false,
    flashVersion: 8,
    allowScriptAccess: "sameDomain",
    onready: function() {
      return console.log('SoundManager ready');
    },
    ontimeout: function() {
      return console.log("SoundManager timeout");
    }
  });
  window.soundManager = soundManager;
  return soundManager;
});

// Load all modules
define(function(require) {
  var modules = [
      './../bower_components/pixi/bin/pixi',
      'cs!classes/Application', 
      'cs!classes/modules/BaseController',
      'signals',
  ];

  require(modules, function (Pixi, Application, BaseController, signals) {
    'use strict';

    // launch signals events
    window.appEvents = {
      nav   : new signals.Signal(),
      smile : new signals.Signal() ,
      camera  : new signals.Signal(),
      canvas  : new signals.Signal(),
      user    : new signals.Signal()
    }

    //window.stats = new Stats();
    //stats.setMode( 1 );
    //document.body.appendChild( stats.domElement );

    // launch application
    window.app = new Application();
  });

});

