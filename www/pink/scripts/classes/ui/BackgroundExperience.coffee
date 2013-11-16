define [
    'jquery',
  ], 
  ($) ->
    class BackgroundExperience
      
      constructor: (p) ->

        # The canvas element we are drawing into.      
        $canvas = $("#canvas")
        $canvas2 = $("#canvas2")
        $canvas3 = $("#canvas3")
        ctx2 = $canvas2[0].getContext("2d")
        ctx = $canvas[0].getContext("2d")
        w = $canvas[0].width
        h = $canvas[0].height
        img = new Image()

        @opacity = undefined
        sy = (Math.random() * 285) >> 0
        sx = (Math.random() * 285) >> 0
        @p = p
      
      move: (timeFac) ->
        p = p + 0.3 * timeFac
        @opacity = (Math.sin(p * 0.05) * 0.5)
        if opacity < 0
          p = opacity = 0
          sy = (Math.random() * 285) >> 0
          sx = (Math.random() * 285) >> 0
        p = p
        ctx.globalAlpha = opacity
        ctx.drawImage $canvas3[0], sy + p, sy + p, 285 - (p * 2), 285 - (p * 2), 0, 0, w, h

        puffs = []
        sortPuff = (p1, p2) ->
          p1.p - p2.p

        puffs.push new Puff(0)
        puffs.push new Puff(20)
        puffs.push new Puff(40)
        newTime = undefined
        oldTime = 0
        timeFac = undefined
        loop_ = ->
          newTime = new Date().getTime()
          oldTime = newTime  if oldTime is 0
          timeFac = (newTime - oldTime) * 0.1
          timeFac = 3  if timeFac > 3
          oldTime = newTime
          puffs.sort sortPuff
          i = 0

          while i < puffs.length
            puffs[i].move timeFac
            i++
          ctx2.drawImage $canvas[0], 0, 0, 570, 570
          setTimeout loop_, 10


        # Turns out Chrome is much faster doing bitmap work if the bitmap is in an existing canvas rather
        # than an IMG, VIDEO etc. So draw the big nebula image into canvas3
        $canvas3 = $("#canvas3")
        ctx3 = $canvas3[0].getContext("2d")
        $(img).bind "load", null, ->
          ctx3.drawImage img, 0, 0, 570, 570
          loop_()

        img.src = "/images/nebula/nebula.jpg"