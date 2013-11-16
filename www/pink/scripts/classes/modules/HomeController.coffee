define [
  'TweenMax', 
  'jquery',
  'cs!classes/modules/BaseController'
  ],
  (TweenMax, $, BaseController) ->
    class HomeController extends BaseController
      _rootNode : null
      _point: null

      tm: null
      _voiceLoop: null

      constructor: ->
        console.log 'HOME CONTROLLER'
        BaseController.call @
        @_rootNode = $('#home')

        #@_point = new Point(200, 300)
        #console.log @_point

      show: ->
        $('.home__title, .home__circle').css({opacity: 0, visibility: 'hidden'})        
        super
        @tm = new TimelineMax({paused: true});
        time = 0
        @tm.to($('.home__title'), 0.5, {autoAlpha: 1}, time)
        @tm.to($('.home__title'), 0.5, {marginTop: 0}, time+=2)
        @tm.to($('.home__title-was'), 0.6, {autoAlpha: 1, ease: Ease.easeOut }, time+=0.5)
        @tm.staggerTo($('.home__circle'), 0.6, {autoAlpha: 1, marginTop: 0, ease: Cubic.easeOut }, 0.5)

        $('.home__circle').css({opacity: 0, marginTop: 10})
        setTimeout (=>
          @tm.play()
          soundManager.play 'sound-a-1',
            onfinish: @_loopAmbiance
            volume: 10
        ), 5000

        @_voiceLoop = setInterval (=>
          number = @randomRange 1, 13
          voiceType = if @randomRange(1, 2) == 1 then "f" else "h"
          soundManager.play 'sound-'+voiceType+'-' + number,
            volume: if voiceType == "f" then 40 else 60
        ), 10000

      # loop sound
      _loopAmbiance: =>
         soundManager.play 'sound-a-1',
            onfinish: @_loopAmbiance
            volume: 10

      randomRange: (min, max) ->
        Math.floor( (Math.random() * (max - min + 1) ) + min)

      hide: ->
        clearInterval @_voiceLoop
        TweenMax.to($('body'), 0.5, {backgroundColor: "#F2C4D0"});
        super

      dispose: ->
        @tm.kill()

      initParams: (params) ->
        console.log params
