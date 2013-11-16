# User Point
define ['jquery'], ($) ->
  class Point

    x: null
    y: null

    # default positions
    _dTX: null
    _dTY: null

    _w: null
    _h: null

    _screenMargin : 20

    constructor: (x, y) ->
      @x = @y = 0
      @_dTX = @_dTY = 0

      @_w = $(window).width()
      @_h = $(window).height()

      @_randomCoordinates()


    # start : random coordinates
    _randomCoordinates: =>
      @x = Math.floor(Math.random() * ((@_w - @_screenMargin) - @_screenMargin))
      @y = Math.floor(Math.random() * ((@_h - @_screenMargin) - @_screenMargin))

      @_dTX = @x
      @_dTY = @y

    # get defaults position
    getDefaultsCoordinates: =>
      x: @_dTX, y: @_dTY

    # get coordinates
    getCoordinates: =>      
      x: @x, y: @y