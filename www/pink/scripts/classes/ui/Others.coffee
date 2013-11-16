define [
    'TweenMax'
    'jquery',
    'cs!classes/display/Other.coffee',
  ], 
  (TweenMax, $, OtherGraphics) ->
    class Others extends PIXI.DisplayObjectContainer

      _users     	  : null
      _indexUser  	: 0
      _usersLength  : 100
      _color        : null

      constructor: (color)->
        super

        @_users = []

        timeAppears = 0
        for i in [0...@_usersLength]
          @_indexUser++
          c = new OtherGraphics(@_indexUser, color)
          @_users.push(c)
          @.addChild c

      update: (dt) ->
        for i in [0...@_users.length]
          @_users[i].update()

      dispose: =>

      setColor: (color) ->
        @_color = color

      showAll: ->
        timeAppear = 0
        for i in [0...@_users.length]
          @_users[i].setColor(@_color)
          @_users[i].fadeIn()
          

        undefined



