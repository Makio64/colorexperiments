define [
    'jquery',
    'cs!classes/ui/Particle',
  ], 
  ($, Particle) ->
    class Particle extends PIXI.Graphics

      _particlesCount : null
      _w: $(window).width()
      _h: $(window).height()

      constructor: (count) ->

        _particlesCount = count

        @x = Math.random() * @_w
        @y = Math.random() * @_h

        @vx = -1 + Math.random() * 2
        @vy = -1 + Math.random() * 2

        @radius = 4

      draw:->
        @fillStyle "white"
        @beginFill()
        @drawCircle(@x, @y, @radius, 0, Math.PI * 2, false)
        @endFill()

      


