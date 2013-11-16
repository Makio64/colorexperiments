define [
    'jquery',
    'cs!classes/utils/SmileDetector'
  ], 
  ($, SmileDetector) ->
    class SmileDetectManager
      
      _smileDetector      : null
      _videoContainer     : null
      _videoID            : null
      _showCamera         : 'hidden'

      _smileState         : null

      _smileInterval      : null


      constructor: ->
        console.log 'SmileDetectManager'
        @_videoID         = "video-camera-smile"
        @_videoContainer  = $("#experience-camera-smile") 
        @_videoContainer.append "<video id='#{@_videoID}' height='426' width='640' style='visibility:#{@_showCamera};' autoplay></video>"

        @_initEvents()
        # false : noSmile // true : smile
        @_smileState = false
        @_smileDetector = new SmileDetector @_videoID

        #@_smileDetector.onSmile @_onSmileHandler
        #@_smileDetector.onSmile @_onSmileHandler

      _onSmileHandler: (isSmile) =>
        preventSmileEvent = if @_smileState != isSmile then true else false 

        if isSmile
          # dispatch only one status per action
          if preventSmileEvent
            window.appEvents.smile.dispatch "$detect.smile"
        else
          if preventSmileEvent
            window.appEvents.smile.dispatch "$detect.noSmile"

        @_smileState = isSmile

      _initEvents: =>
        window.appEvents.camera.add @_cameraStatesHandler

      _cameraStatesHandler: (event) =>
        switch event
          when "$camera.ready"   then @_cameraReady()
          when "$camera.refused" then @_cameraPermissionRefused()
          else return 0

      # camera activated by user
      _cameraReady: =>
        console.log 'CAMERA ACTIVATED'
        # start camera
        #@start 300
        @_smileInterval = setInterval (=>
          @_smileDetector.startDetect()
        ), 2000

      _cameraPermissionRefused: =>
        console.log 'CAMERA PERMISSION REFUSED'

      dispose: ->
        clearInterval @_smileInterval

      # deprecated (also see webworkers)
      start: (interval, callback) ->
        @_smileDetector.start(interval, callback)


