define [
    'TweenMax'
    'jquery',
  ], 
  (TweenMax, $) ->
    class WavesPoint extends PIXI.Graphics
      _x: null
      _y: null
      _alt: null
      _yStart: null

      constructor: (x, y, alt) ->
        @_x = x
        @_y = y
        @_alt = alt

      update: (i) ->
