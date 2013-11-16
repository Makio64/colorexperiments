define [
    'TweenMax', 
    'jquery',
    'cs!classes/modules/BaseController',
    'cs!classes/ui/CanvasGL'
    'cs!classes/ui/SmileDetectManager'
    'cs!classes/models/User'
  ],
  (TweenMax, $, BaseController, CanvasGL, SmileDetectManager, User) ->
    class ExperienceController extends BaseController
      
      _rootNode : null
      _canvas   : null

      _user     : null
      _opposedUser: null

      _tm       : null    
      _loopSmileMe : null 

      _voiceType: null
      _sexColor: null

      _startExperienceEvent: true

      constructor: ->
        console.log 'EXPERIENCE CONTROLLER'
        BaseController.call @
        @_rootNode = $('#experience')

        # waiting for camera state
        window.appEvents.camera.add @_userActions

        @_canvas = new CanvasGL "experience-canvas"
      
      _userActions: (event) =>
        switch event                                                                                                                                                                                                     
          when "$camera.ready" then @_initUsers()
          when "$camera.refused" then @_deactivateUsers()
          else return 0


      # initialize users
      _initUsers: =>
        console.log @_sexColor
        @_user = new User 1, "player1", @_sexColor
        @_canvas.addUser @_user

        @_opposedUser = new User 2, "player2", @_user.getOpposedColor()
        @_canvas.addOpposedUser @_opposedUser

        # start experience
        window.appEvents.smile.add @_displayImage


      # bind once
      _displayImage: =>

        if !@_startExperienceEvent
          return
        @_startExperienceEvent = false
        tmImg = new TimelineMax({onComplete: @startExperience})
        time = 0
        tmImg.to($('#boy_face'), 0.8, {ease: Cubic.easeIn, autoAlpha: 1 }, time)
        tmImg.to($('#boy_face'), 0.8, {ease: Cubic.easeIn, autoAlpha: 0 }, time+=5)

      # remove users
      _deactivateUsers: =>


      _simulateCamera: =>
        console.log 'simulation camera ready'
        setTimeout (->
          window.appEvents.camera.dispatch "$camera.ready"
        ), 1000

      show: ->
        @_voiceType = if @sexColor == "boy" then "f" else "h"

        @_tm = new TimelineMax({paused: true, onComplete: @endExperienceAnimation})
        time = 0
        @_tm.to($('.experience__title'), 0.5, {autoAlpha: 1, ease: Cubic.easeOut}, time+=0.3)

        @_loopSmileMe = setInterval (=>
          soundManager.play 'sound-'+@_voiceType+'-13',
            volume: if @_voiceType == "f" then 30 else 60
        ), 10000

        @_tm.play()

        super

      endExperienceAnimation: =>
        console.log 'endExperienceAnimation'
        @_tm.kill()
        @_smile  = new SmileDetectManager();

        #@_canvas.update()
        #
        #@_simulateCamera()

      randomRange: (min, max) ->
        Math.floor( (Math.random() * (max - min + 1) ) + min)

      startExperience: =>

        @_startExperienceEvent = false
        clearInterval @_loopSmileMe
        TweenMax.to($('.experience__title'), 0.5, {autoAlpha: 0, marginTop: -30, ease: Cubic.easeOut, onComplete: @_startImmersion})

      _startImmersion: =>
        #launch render canvas for canvasGL
        @_canvas.active = true
        @_canvas.initSmileListeners()

        # init sound
        @_voiceLoop = setInterval (=>
          number = @randomRange 1, 13
          voiceType = if @randomRange(1, 2) == 1 then "f" else "h"
          soundManager.play 'sound-'+voiceType+'-' +number,
            volume: if voiceType == "f" then 40 else 60
        ), 10000

        $('#boy_face').addClass('next')
        window.appEvents.smile.add @_tweenNotify

      _tweenNotify: =>
        $('#boy_face').css({marginLeft: 0})
        tmImg = new TimelineMax()
        time = 0
        tmImg.to($('#boy_face'), 0.8, {ease: Cubic.easeIn, autoAlpha: 1 }, time)
        tmImg.to($('#boy_face'), 0.8, {ease: Cubic.easeIn, autoAlpha: 0 }, time+=5)

        tmImg.play()

      hide: ->
        super

      initListeners: ->

      initParams: (params) ->
        @_sexColor = params

      dispose: ->
        super
