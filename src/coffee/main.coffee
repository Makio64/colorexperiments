main = null

class Main

	dt 				: 0
	lastTime 		: 0
	pause 			: false

	constructor:()->		
		@pause = false
		@lastTime = Date.now()
		window.focus()
		requestAnimationFrame( @animate )

		# Entry Point 
		colors = ["pink","yellow","orange","red","green","purple","white","darkblue","skyblue","grey"]
		for color in colors
			@initColor(color)
		return

	initColor:(color)->
		$(".#{color}").mouseover((e)->
			$("##{color} div").addClass("activate")
			$(".#{color} div").addClass("activate")
		).mouseout((e)->
			$("##{color} div").removeClass("activate")
			$(".#{color} div").removeClass("activate")
		)



	animate:()=>
		
		if @pause
			t = Date.now()
			dt = t - @lastTime
			@lastTime = t
			return

		requestAnimationFrame( @animate )
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
		requestAnimationFrame( main.animate )
		main.lastTime = Date.now()
		main.pause = false
	)

	$(window).resize(()=>
		main.resize()
	)
	return