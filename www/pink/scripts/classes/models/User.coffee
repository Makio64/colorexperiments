# USER
define [
  'cs!classes/models/BaseUser',
  'cs!classes/ui/Point'
  ],
  (BaseUser, Point) ->
    class User extends BaseUser

      constructor: (id, username, sex) ->
        console.log "User"
        BaseUser.call @
        super(id, username, sex)

        @_addPoint()

      # attribute coordinates
      _addPoint: ->
        @point = new Point()

      # set point
      setPoint: (point) ->

      removePoint: (point) ->

      getOpposedColor: (color) ->
        super
