#MODULE MANAGER
define [
    'cs!classes/Nav'
    'cs!classes/modules/HomeController', 
    'cs!classes/modules/ExperienceController'
  ], 
  (NAV, HomeController, ExperienceController) ->

    class ModuleManager

      _currentModule: null
      _nextModuleID: null
      _nextModuleParams: null
      _modules: null

      constructor: ->
        # classes nav manager
        @_modules = []
        @_modules[NAV.HOME]       = HomeController;
        @_modules[NAV.EXPERIENCE] = ExperienceController

        window.appEvents.nav.add @_eventNavWillChange

      # before change modules
      _eventNavWillChange: (event, module) =>
        #block event
        window.appEvents.nav.active = false
        @_nextModuleID = module.view
        @_nextModuleParams = module.params if module.params
        if @_currentModule == null then @_show() else @_hide()

      _show: =>
        # sure that view doesn't exist
        @_currentModule = new @_modules[@_nextModuleID]()
        @_currentModule.initParams(@_nextModuleParams)
        @_currentModule.show()
        # unblock event
        window.appEvents.nav.active = true

      _hide: =>
        @_currentModule.hide()
        @_show()

      deactivate: =>
        window.appEvents.nav.remove @_eventNavWillChange