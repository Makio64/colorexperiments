define [
    'jquery',
    'cs!classes/NavManager', 
    'cs!classes/ModuleManager', 
    'cs!classes/Nav',
    'cs!classes/utils/AudioLoader',
    'cs!classes/utils/AudioManager',
    'cs!classes/ui/Background',
  ], 
  ($, NavManager, ModuleManager, NAV, AudioLoader, AudioManager, Background) ->
    class Application
      
      _navManager     : null
      _bg             : null 
      _canvasExpStatus: false

      constructor: ->

        # launch animation request frame
        w = window
        for vendor in ['ms', 'moz', 'webkit', 'o']
            break if w.requestAnimationFrame
            w.requestAnimationFrame = w["#{vendor}RequestAnimationFrame"]
            w.cancelAnimationFrame = (w["#{vendor}CancelAnimationFrame"] or
                                      w["#{vendor}CancelRequestAnimationFrame"])

        targetTime = 0
        w.requestAnimationFrame or= (callback) ->
            targetTime = Math.max targetTime + 16, currentTime = +new Date
            w.setTimeout (-> callback +new Date), targetTime - currentTime
        w.cancelAnimationFrame or= (id) -> clearTimeout id

        # background
        #@_bg = new Background()

        # instanciate audio loader
        @_audioManager  = new AudioLoader() 

        # instanciate NavManager
        @_navManager    = new NavManager()

        # instanciate ModuleManager
        @_moduleManager = new ModuleManager()

        # set default view
        @_navManager.set NAV.HOME

        @initListeners()

        # init request animation frame
        @update()

        window.appEvents.canvas.add @_canvasExpHandler

      initListeners: ->
        $('button.link__internal, a.link__internal').on "click", @_setView

      _canvasExpHandler: (event) =>
        switch event
          when "start"  then @_canvasExpStatus  = true
          when "stop"   then @_canvasExpStatus  = false
          else undefined

      _setView: (e)=>
        e.preventDefault() if e
        @_navManager.set $(e.target).attr('data-nav-id'), $(e.target).attr('data-nav-params')

      update: (dt) =>
        #@_bg.render() if @_bg
        requestAnimationFrame @update
        #window.stats.begin()
        window.canvasGL.update() if @_canvasExpStatus && window.canvasGL.active
        #window.stats.end()

      stop: ->
        cancelAnimationFrame @update