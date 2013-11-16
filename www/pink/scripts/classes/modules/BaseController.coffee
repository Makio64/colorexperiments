define ['jquery'], ($) ->
  class BaseController

    _rootNode: null

    # constructor
    constructor: ->
      @initListeners()

    # show module
    show: ->
      @_rootNode.removeClass 'hide'

    # hide module
    hide: ->
      @_rootNode.addClass 'hide'
      @dispose()

    # listeners
    initListeners: ->

    # dispose
    dispose: ->

    # get params click
    initParams: (params) ->
      @params = params
