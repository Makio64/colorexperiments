define [], () ->
  class Background
    # variable declarations
    canvas: null
    gl: null
    buffer: null
    vertex_shader: null

    fragment_shader: null
    currentProgram: null
    vertex_position: null

    parameters: null
    self  : null 

    # functions
    constructor: ->
      @parameters =
        start_time  : new Date().getTime()
        time        : 0
        screenWidth : 0
        screenHeight: 0

      @vertex_shader = document.getElementById('vs').textContent
      @fragment_shader = document.getElementById('fs').textContent

      @canvas = document.getElementById("canvas-background")
      @canvas.style.position = "absolute"
      @canvas.style.top      = @canvas.style.left = "0px"
      @canvas.style.display  = "block"

      # Initialise WebGL
      try
        @gl = @canvas.getContext('experimental-webgl')
      catch error
        alert('canvas.getContext error: ' + error)
      unless @gl
        throw new Error('cannot create webgl context')

      # Create Vertex buffer (2 triangles)
      @buffer = @gl.createBuffer()
      @gl.bindBuffer(@gl.ARRAY_BUFFER, @buffer)
      @gl.bufferData(@gl.ARRAY_BUFFER,
        new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
          1.0, -1.0, 1.0, 1.0, -1.0, 1.0]),
        @gl.STATIC_DRAW)

      # Create Program
      @currentProgram = @createProgram(@vertex_shader, @fragment_shader)

      @onWindowResize()
      window.addEventListener('resize', @onWindowResize, false)


    createProgram: (vertex, fragment) ->
      program = @gl.createProgram()

      # only used here
      createShader = (src, type) =>
        shader = @gl.createShader(type)

        @gl.shaderSource(shader, src)
        @gl.compileShader(shader)

        unless @gl.getShaderParameter(shader, @gl.COMPILE_STATUS)
          typestr = if type is @gl.VERTEX_SHADER then 'VERTEX' else 'FRAGMENT'
          alert("#{typestr} SHADER COMPILE ERROR:\n#{@gl.getShaderInfoLog(shader)}")
          return null

        # return shader
        shader

      vs = createShader(vertex, @gl.VERTEX_SHADER)
      fs = createShader(fragment, @gl.FRAGMENT_SHADER)

      if vs is null or fs is null
        return null

      @gl.attachShader(program, vs)
      @gl.attachShader(program, fs)

      @gl.deleteShader(vs)
      @gl.deleteShader(fs)

      @gl.linkProgram(program)

      unless @gl.getProgramParameter(program, @gl.LINK_STATUS)
        alert('GL LINK ERROR:\n' +
          "STATUS:\n#{@gl.getProgramParameter(program, @gl.VALIDATE_STATUS)}\n" +
          "ERROR:\n#{@gl.getError()}")
        return null

      # return program
      program

    onWindowResize: (event) =>
      @canvas.width = window.innerWidth
      @canvas.height = window.innerHeight
      @parameters.screenWidth = @canvas.width
      @parameters.screenHeight = @canvas.height

      @gl.viewport(0, 0, @canvas.width, @canvas.height)

      # don't return anything
      undefined

    animate: ->
      @render()
      # don't return anything
      undefined

    render: ->
      unless @currentProgram
        return

      @parameters.time = new Date().getTime() - @parameters.start_time

      @gl.clear(@gl.COLOR_BUFFER_BIT | @gl.DEPTH_BUFFER_BIT)

      # Load program into GPU
      @gl.useProgram(@currentProgram)

      # Set values to program variables
      @gl.uniform1f(@gl.getUniformLocation(@currentProgram, 'time'),
        @parameters.time / 1000)
      @gl.uniform2f(@gl.getUniformLocation(@currentProgram, 'resolution'),
        @parameters.screenWidth, @parameters.screenHeight)

      # Render geometry
      @gl.bindBuffer(@gl.ARRAY_BUFFER, @buffer)
      @gl.vertexAttribPointer(@vertex_position, 2, @gl.FLOAT, false, 0, 0)
      @gl.enableVertexAttribArray(@vertex_position)
      @gl.drawArrays(@gl.TRIANGLES, 0, 6)
      @gl.disableVertexAttribArray(@vertex_position)