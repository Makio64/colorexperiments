define [
    'TweenMax'
    'jquery',
    'cs!classes/models/User',
  ], 
  (TweenMax, $, User) ->
    class Other extends PIXI.Graphics

      _user   : null
      _r      : null
      _c      : null
      _n      : null
      _d      : null
      _points : null

      _w : 0
      _h : 0

      vX: 0
      vY: 0

      vtX : 0
      vtY : 0

      x: 0
      y: 0

      angle: null
      radians: null
      speed: 0.2

      _loopTM   : null 
      _isPaused : false

      userReady: false

      constructor: (id) ->
        super
        @_user = new User id, "other"+id
        @_r = 0
        @_rayonMax = 10
        @_d = 10 * 2
        @_n = 100
        @_c = "0xFFFFFF"

        @vX = (Math.random() * (2 - 0.1 + 1) ) + 0.1
        @vY = (Math.random() * (2 - 0.1 + 1) ) + 0.1

        @angle = @randomRange(0, 360)
        @radians = @angle * Math.PI  / 180

        @_w = $(window).width()
        @_h = $(window).height()

        @position.x = @_user.point.x
        @position.y = @_user.point.y

        @updateDirection()

      draw: ->
        @clear()
        @beginFill(@_c, 0.3)
        @drawCircle(@position.x, @position.y, @_r)
        @position.x += @vtX
        @position.y += @vtY
        @endFill()

        if @position.x > @_w + @_rayonMax + 15 || @position.x < 0 + @_rayonMax / 2
          @angle = 180 - @angle;
          @updateDirection()
        else if @position.y > @_h - @_rayonMax + 15 || @position.y < 0 + @_rayonMax / 2
          @angle = 360 - @angle;
          @updateDirection()

      fadeIn: ->
        @userReady = true
        @_r = 10



      setColor: (color) ->
        @_c = color

      randomRange: (min, max) ->
        Math.floor( (Math.random() * (max - min + 1) ) + min)

      updateDirection: ->
        @radians = @angle * Math.PI / 180
        @vtX = Math.cos(@radians) * @speed
        @vtY = Math.sin(@radians) * @speed

      update: (dt) ->
        @draw()