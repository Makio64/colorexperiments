define [
    'TweenMax'
    'jquery',
  ], 
  (TweenMax, $) ->
    class Radar extends PIXI.Graphics

      _id: 0

      constructor: (id)->
        super
        @_id      = id 
        @_color   = "0xF25790"
        @_rayon   = 0
        @_opacity = 1

      start: (done) ->
        TweenMax.to(@, 4, {_rayon: 300, _opacity:0, ease: Cubic.easeOut, onComplete: done})

      draw: ->
        @clear()
        @_drawCirc @_rayon, @_color, @_opacity

      _drawCirc: (rayon, color, opacity) ->
        @beginFill(color, opacity)
        @drawCircle(Math.floor(window.innerWidth/2), Math.floor(window.innerHeight/2), rayon)
        @endFill()

      update: (dt) ->
        @draw()

      clear: ->
        super






