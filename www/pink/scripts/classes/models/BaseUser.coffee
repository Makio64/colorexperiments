# BaseUser
define [], () ->
    class BaseUser

      _id       : null
      username  : null
      point     : null
      sex       : null
      sexColor  : null

      params    : null

      constructor: (id, username, sex)->
        @_id        = id
        @username   = username
        @sex        = if !sex then "girl" else sex
        @point      = {}

        @sexColor   = if @sex == "girl" then "0x9D6FAB" else "0x4D8B8F"

      # add point to user
      _addPoint: (point) ->

      # set point coordinates
      setPoint: (point) ->

      # remove user point
      removePoint: (point) ->

      # dispose
      dispose: =>

      # get params click
      initParams: (params) ->
        @params = params

      getOpposedColor: ->
        _c = null
        if @sexColor == "0x9D6FAB"
          _c = "0x4D8B8F"
        else
          _c = "0x9D6FAB"
        _c

