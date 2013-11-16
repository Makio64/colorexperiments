define [
    'jquery',
    'cs!classes/ui/Particle',
  ], 
  ($, Particle) ->
    class Particles extends PIXI.DisplayObjectContainer
      
      _w: $(window).width()
      _h: $(window).height()

      _particlesCount: 150
      _particles: []
      _minDist: 75

      constructor: ->
        for i in [0...@_particlesCount]
          p = new Particle()
          @_particles.push(p)
          @.addChild p


      update: ->
        for i in [0...@_particles.length]
          p = @_particles[i]
          p.x = p.vx
          p.y = p.vy

          if p.x + p.radius > @_w
            p.x = p.radius
          else if p.x - p.radius < 0
            p.x = @_w - p.radius

          if p.y + p.radius > @_h
            p.y = p.radius
          else if p.y - p.radius < 0
            p.y = @_h - p.radius

          for j in [0...@_particles.length]
            p2 = @_particles[j]
            @distance p, p2


      distance: (p1, p2) ->
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
        
        dist = Math.sqrt(dx*dx + dy*dy);
            
        if dist <= @minDist
          ctx.beginFill();
          ctx.lineStyle 1, "0x000000", (1.2-dist/@minDist);
          @moveTo(p1.x, p1.y);
          @lineTo(p2.x, p2.y);
          @endFill()
          
        ax = dx/2000
        ay = dy/2000

        p1.vx -= ax
        p1.vy -= ay
          
        p2.vx += ax
        p2.vy += ay