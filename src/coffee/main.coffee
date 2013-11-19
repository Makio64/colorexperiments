main = null

class Main

	dt 				: 0
	lastTime 		: 0
	pause 			: false

	iframe			: null

	constructor:()->
		@pause = false
		@lastTime = Date.now()
		window.focus()
		# requestAnimationFrame( @animate )

		# Entry Point
		colors = ["pink","yellow","orange","red","green","purple","white","darkblue","skyblue","grey"]
		for color in colors
			@initColor(color)

		return

	initColor:(color)=>
		$(".#{color}").mouseover((e)=>
			if @iframe == null
				$("##{color} div").addClass("activate")
				$(".#{color} div").addClass("activate")
			else
				$(".#{color}").addClass("reveal")
				# class = "#{color}"
				# console.log(class);
				$('header').addClass("#{color}")

		).mouseout((e)=>
			$("##{color} div").removeClass("activate")
			$(".#{color} div").removeClass("activate")
			$(".#{color}").removeClass("reveal")
			$('header').removeClass("#{color}")
		).click((e)=>
			if @iframe
				document.body.removeChild(@iframe)
				@iframe = null
			else
				$("##{color} div").removeClass("activate")
				$(".#{color} div").removeClass("activate")
				$("header, h1, h2, #global").addClass("activate")
				$(".bubble, .bubble2").addClass("mini")
				$("#about").remove()
			@iframe = document.createElement("IFRAME")
			@iframe.setAttribute("src", "./"+color)
			@iframe.style.position = "absolute"
			@iframe.style.bottom = 0
			@iframe.style.left = 0
			@iframe.style.zIndex = 100
			@iframe.style.width = window.innerWidth+"px"
			@iframe.style.height = (window.innerHeight-50)+"px"
			document.body.appendChild(@iframe)
		)
		return

	animate:()=>

		if @pause
			t = Date.now()
			dt = t - @lastTime
			@lastTime = t
			return

		# requestAnimationFrame( @animate )
		t = Date.now()
		dt = t - @lastTime
		@lastTime = t

		# Push the update things each frame here
		return


	resize:()->
		width 	= window.innerWidth
		height 	= window.innerHeight
		# resize here
		if @iframe
			@iframe.style.width = width+"px"
			@iframe.style.height = (height-50)+"px"
		return



$(document).ready ->
	main = new Main()

	$(window).blur(()->
		main.pause = true
		# cancelAnimationFrame(main.animate)
	)

	$(window).focus(()->
		# requestAnimationFrame( main.animate )
		main.lastTime = Date.now()
		main.pause = false
	)

	$(window).resize(()=>
		main.resize()
	)
	return
