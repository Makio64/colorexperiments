define [
    'TweenMax'
    'jquery',
  ], 
  (TweenMax, $) ->
    class OpposedUser extends PIXI.Graphics

      _user   : null
      _r      : null
      _c      : null
      _n      : null
      _d      : null
      _points : null

      _loopTM   : null 
      _isPaused : false

      _preventSmileAnimation: false
      _isUserSmiling: false

      userReady : false

      constructor: (user) ->
        super
        @_user = user
        @_r = 0
        @_d = 10 * 2
        @_n = 100
        @_c = @_user.sexColor
        @_points = []
