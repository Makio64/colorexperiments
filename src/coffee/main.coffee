main = null

class Main

	dt 				: 0
	lastTime 		: 0
	pause 			: false

	constructor:()->		
		@pause = false
		@lastTime = Date.now()
		window.focus()
		requestAnimFrame( @animate )

		# Entry Point 
		# ...

		return


	animate:()=>
		
		if @pause
			t = Date.now()
			dt = t - @lastTime
			@lastTime = t
			return

		requestAnimFrame( @animate )
		t = Date.now()
		dt = t - @lastTime
		@lastTime = t

		# Push the update things each frame here
		return


	resize:()->
		width 	= window.innerWidth
		height 	= window.innerHeight
		# resize here
		return



$(document).ready ->
	main = new Main()
	
	$(window).blur(()->
		main.pause = true
		cancelAnimationFrame(main.animate)
	)

	$(window).focus(()->
		requestAnimFrame( main.animate )
		main.lastTime = Date.now()
		main.pause = false
	)

	$(window).resize(()=>
		main.resize()
	)
	return