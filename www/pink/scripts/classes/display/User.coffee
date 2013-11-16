define [
    'TweenMax'
    'jquery',
  ], 
  (TweenMax, $) ->
    class User extends PIXI.Graphics

      _user   : null
      _r      : null
      _c      : null
      _n      : null
      _d      : null
      _points : null

      _loopTM   : null 
      _isPaused : true

      _preventSmileAnimation: false
      _isUserSmiling: false

      userReady : false
      canMove: true

      vX: 0
      vY: 0

      angle: 0
      radians: 0

      _w: 0
      _h: 0

      constructor: (user) ->
        super
        @_user = user
        @_r = 0
        @_d = 10 * 2
        @_n = 100
        @_c = @_user.sexColor
        @_points = []

        # create point loop
        @_loopTM = new TimelineMax({paused: @_isPaused, repeat: -1, onRepeat: ->
          console.log 'on repeat!!'
        })
        time = 0
        @_loopTM.to(@, 2, {_r: 20, ease:Ease.easeInOut}, time)
        @_loopTM.to(@, 2, {_r: 15, ease:Ease.easeInOut}, time+=2)        
        @_loopTM.to(@, 2, {_r: 20, ease:Ease.easeInOut}, time+=2)        

        setTimeout (=>
           @userReady = true
           window.appEvents.smile.add @_smileActionsHandle
        ), 1000

        @vX = (Math.random() * (2 - 0.1 + 1) ) + 0.1
        @vY = (Math.random() * (2 - 0.1 + 1) ) + 0.1

        @angle = @randomRange(0, 360)
        @radians = @angle * Math.PI  / 180

        @_w = $(window).width()
        @_h = $(window).height()

        @position.x = 200
        @position.y = 250

        @updateDirection()

        console.log 'user', @position.x, @position.y

        @show()

      show: ->
        TweenMax.fromTo(@, 0.8, {_r: 0}, {_r: 20, ease: Cubic.easeOut, onComplete: @_userShown})

      hide: ->
        TweenMax.fromTo(@, 0.8, {_r: @_r}, {_r: 0, ease: Cubic.easeOut, onComplete: @_userHidden})

      _userShown: =>
        #restart loop
        console.log "user shown"
        @_preventSmileAnimation = false
        @_loopTM.restart()

      _userHidden: =>
        @_preventSmileAnimation = false

        # we can ask user smiling

      draw: ->
        @clear()
        @beginFill(@_c, 1)
        @drawCircle(@position.x, @position.y, @_r)

        if @canMove
          @position.x += @vtX
          @position.y += @vtY

        @endFill()

        if @canMove
          if @position.x > @_w + @_rayonMax + 15 || @position.x < 0 + @_rayonMax / 2
            @angle = 180 - @angle;
            @updateDirection()
          else if @position.y > @_h - @_rayonMax + 15 || @position.y < 0 + @_rayonMax / 2
            @angle = 360 - @angle;
            @updateDirection()

      updateDirection: ->
        @radians = @angle * Math.PI / 180
        @vtX = Math.cos(@radians) * @speed
        @vtY = Math.sin(@radians) * @speed

      randomRange: (min, max) ->
        Math.floor( (Math.random() * (max - min + 1) ) + min)

      update: (dt) ->
        @draw() if @userReady

      clear: ->
        super

      getCirclePoints: ->
        #for i in [1...@_n + 1]
          #x = @_user.point.x + @_r * Math.sin(i*2*Math.PI/@_n)
          #y = @_user.point.y + @_r * Math.cos(i*2*Math.PI/@_n)
          #@_points.push([x, y])

      pause: ->
        @_isPaused = !@_isPaused

      stopLoop: ->
        @_loopTM.stop()

      restartLoop: ->
        @_loopTM.restart()

      _smileActionsHandle: (event) =>
        if @_preventSmileAnimation
          return

        if event == "smile"
          @smilingOnScreen()

        # else
        #   if @_isUserSmiling
        #     console.log "user :: hide"
        #     @_preventSmileAnimation = true
        #     @hide()
        #     @_isUserSmiling = false


      smilingOnScreen: ->
        if !@_isUserSmiling
          console.log "user :: show"
          @_preventSmileAnimation = true
          window.appEvents.user.dispatch "smile"
          @_isUserSmiling = true











