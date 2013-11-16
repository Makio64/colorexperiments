define [
    'jquery',
  ], 
  ($) ->
    class AudioLoader
      _ambiance     : []
      _voicesMen    : []
      _voicesWomen  : []

      constructor: ->
        @_voicesMen = [
          {id: 'sound-h-1', url: './../sounds/men/h-1.mp3'},
          {id: 'sound-h-2', url: './../sounds/men/h-2.mp3'},
          {id: 'sound-h-3', url: './../sounds/men/h-3.mp3'},
          {id: 'sound-h-4', url: './../sounds/men/h-4.mp3'},
          {id: 'sound-h-5', url: './../sounds/men/h-5.mp3'},
          {id: 'sound-h-6', url: './../sounds/men/h-6.mp3'},
          {id: 'sound-h-7', url: './../sounds/men/h-7.mp3'},
          {id: 'sound-h-8', url: './../sounds/men/h-8.mp3'},
          {id: 'sound-h-9', url: './../sounds/men/h-9.mp3'},
          {id: 'sound-h-10', url: './../sounds/men/h-10.mp3'},
          {id: 'sound-h-11', url: './../sounds/men/h-11.mp3'},
          {id: 'sound-h-12', url: './../sounds/men/h-12.mp3'},
          {id: 'sound-h-13', url: './../sounds/men/h-13.mp3'}
        ]

        @_voicesWomen = [
          {id: 'sound-f-1', url: './../sounds/women/f-1.mp3'},
          {id: 'sound-f-2', url: './../sounds/women/f-2.mp3'},
          {id: 'sound-f-3', url: './../sounds/women/f-3.mp3'},
          {id: 'sound-f-4', url: './../sounds/women/f-4.mp3'},
          {id: 'sound-f-5', url: './../sounds/women/f-5.mp3'},
          {id: 'sound-f-6', url: './../sounds/women/f-6.mp3'},
          {id: 'sound-f-7', url: './../sounds/women/f-7.mp3'},
          {id: 'sound-f-8', url: './../sounds/women/f-8.mp3'},
          {id: 'sound-f-9', url: './../sounds/women/f-9.mp3'},
          {id: 'sound-f-10', url: './../sounds/women/f-10.mp3'},
          {id: 'sound-f-11', url: './../sounds/women/f-11.mp3'},
          {id: 'sound-f-12', url: './../sounds/women/f-12.mp3'},
          {id: 'sound-f-13', url: './../sounds/women/f-13.mp3'}
        ]

        @_ambiance = [
          id: 'sound-a-1', url: './../sounds/ambiance/a-1.mp3'
        ]

        @_preloadAudio()

      _preloadAudio: ->
        for i in [0...@_voicesMen.length]
          @_voicesMen[i].autoLoad = true
          soundManager.createSound @_voicesMen[i] if @_voicesMen[i]
        for i in [0...@_voicesWomen.length]
          @_voicesWomen[i].autoLoad = true
          soundManager.createSound @_voicesWomen[i] if @_voicesWomen[i]
        for i in [0...@_ambiance.length]
          @_ambiance[i].autoLoad = true
          soundManager.createSound @_ambiance[i] if @_ambiance[i]

