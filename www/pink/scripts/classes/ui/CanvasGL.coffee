define [
    'jquery'
    'cs!classes/display/User'
    'cs!classes/display/OpposedUser'
    'cs!classes/ui/Radar'
    'cs!classes/ui/Others'
  ], 
  ($, User, OpposedUser, Radar, Others) ->

    class CanvasGL
      
      _w      : null
      _h      : null
      _el     : null

      _user  : null
      _radar: null
      _others : null
      _particles: null

      _stage    : null
      _renderer : null
      _userGRDispContainer : null

      initSmileListeners: false

      active: false

      _stepIndex: 0

      constructor: (container) ->

        window.canvasGL = @
        
        @_el = document.getElementById(container)

        # create canvas
        @_createCanvas()

        # dispatch start to main application 
        window.appEvents.canvas.dispatch "start"
        
        @initListeners()

        # resize
        $(window).resize @_resize
        setTimeout @_resize, 0

      _createCanvas: =>
        # 0xED146F
        @_stage             = new PIXI.Stage()
        @_stage.interactive = true
        @_renderer          = new PIXI.CanvasRenderer(@_w, @_h, null, true)
        @_el.appendChild(@_renderer.view)
        @_renderer.view.style.position = "absolute"
        @_renderer.view.style.top      = @_renderer.view.style.left = "0px"
        @_renderer.view.style.display  = "block"


        @_others = new Others()
        @_stage.addChild @_others

        @_userDispContainer = new PIXI.DisplayObjectContainer()
        @_stage.addChild @_userDispContainer

        #@_particles = new Particles()
        #@_stage.addChild @_particles

        # create Radar
        @_radar = new Radar()
        @_stage.addChild @_radar

      _resize: =>
        @_w = window.innerWidth
        @_h = window.innerHeight
        @_renderer.resize @_w, @_h

      # graphic create point
      addUser: (entity) =>
        @_user = new User(entity)
        @_userDispContainer.addChild @_user

        # add others
        @_others.setColor(entity.getOpposedColor())
        @_others.showAll()

      addOpposedUser: (entity) =>
        @_opposedUser = new OpposedUser(entity)
        @_userDispContainer.addChild @_opposedUser

        # add choosen one

      # GLOBAL REDRAWING STAGE
      update: (dt) =>
        #requestAnimationFrame @update
        @_user.update() if @_user
        @_radar.update() if @_radar
        @_others.update() if @_others
        @_renderer.render @_stage


      initSmileListeners: ->
        window.appEvents.user.add @_doSmileDown

      # hack if we are somme trouble
      initListeners: ->
        $(window).keydown @_doKeyDown

      _doKeyDown: (event) =>

        if event == "smile"
          @_nextStep()

        if event.keyCode == 37
          @_nextStep()
          
      _doSmileDown: ->
        if event == "smile"
          @_nextStep()

      _nextStep: ->
        switch @_stepIndex
          when 0 then @_launchStepOne()
          when 1 then @_launchStepTwo()
          when 2 then @_launchStepThree()
          else undefined

      _launchStepOne: ->
        console.log 'launch first step'
        @_user.smilingOnScreen()
        @_stepIndex++

      _launchStepTwo: ->
        console.log 'launch second step'
        @_user.canmove = true
        @_stepIndex++

      _launchStepThree: ->
        console.log 'launch third step'
        @_user.slowly = true
        @_stepIndex++






