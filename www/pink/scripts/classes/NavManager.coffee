define ['cs!classes/Nav'], (NAV) ->  
  # NavManager
  class NavManager
    _currentID: null
    _params   : null

    constructor: ->

    set: (id, params) ->
      return if @_currentID == id
      @_currentID = id
      @_params = params if params
      # dispatch view that will replace the previous view
      window.appEvents.nav.dispatch "$nav.eventWillChange", view: @_currentID, params: @_params