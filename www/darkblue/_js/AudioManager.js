function AudioManager(sources,muteHandler)
{
  this.context = null;
  this.bufferLoader = null;
  this.bufferList = null;
  this.sources = sources;
  this.muteHandler = muteHandler;
  this.songs = [];
  this.playing = false;
  this.gainNodes = [];
}

AudioManager.prototype.init = function()
{
  var self = this;
  
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  self.context = new AudioContext();
  
  self.bufferLoader = new BufferLoader(self.context,self.sources,self);
  self.bufferLoader.load();

  self.muteHandler.addEventListener('click', self.bind(self, self.mute), false);
}

AudioManager.prototype.finishedLoading = function(bufferList)
{
  console.log('finishedLoading');
  readyToGo();
  this.bufferList = bufferList;
  this.play();
}

AudioManager.prototype.play = function()
{
  for(var i=0; i<this.sources.length; i++)
  {
    if( this.gainNodes.length < this.sources.length )
      this.gainNodes[i] = this.context.createGain();  
    
    this.gainNodes[i].connect(this.context.destination);
    
    this.sources[i] = this.context.createBufferSource();
    this.sources[i].buffer = this.bufferList[i];
    this.sources[i].loop = true;
    this.sources[i].connect(this.gainNodes[i]);

    // Play both sounds
    if( this.sources[i].start )
    {
      this.sources[i].start(0);
    }
    else
    {
      this.sources[i].noteOn(0);
    }
  }
  this.initCrossfade( 0 );
  this.playing = true;
}

AudioManager.prototype.mute = function()
{
  console.log('handle mute');
  if( this.playing == true )
  {
    for(var i=0; i<this.sources.length; i++)
    {
      if( this.sources[0].stop )
      {
        this.sources[i].stop(0);
      }
      else
      {
        this.sources[i].noteOff(0);
      }
    }

    this.playing = false;
  }
  else
  {
    this.playing = true;
    this.play();
  }

  return false;
}

AudioManager.prototype.crossfade = function(element) {
  var x = parseInt(element.value) / parseInt(element.max);
  // Use an equal-power crossfading curve:
  var gain1 = Math.cos(x * 0.5*Math.PI);
  var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
  
  // if( gain1 > .2 && gain1 < .85 || gain2 > .2 && gain2 < .85 )
  // {console.log('filtering');
    // if( this.filter != undefined )
    //   this.filter.disconnect(0);

    // if( this.filter2 != undefined )
    //   this.filter2.disconnect(0);

    // this.filter = this.context.createBiquadFilter();
    // this.filter2 = this.context.createBiquadFilter();

    // /*

    //   Filter types:

    //   enum BiquadFilterType
    //   {
    //     "lowpass",
    //     "highpass",
    //     "bandpass",
    //     "lowshelf",
    //     "highshelf",
    //     "peaking",
    //     "notch",
    //     "allpass"
    //   };

    // */
    // this.filter.type = 0; // LOWPASS
    // this.filter.quality = 30;
    // //this.filter.frequency.value = 5000;

    // this.filter2.type = 5; // LOWPASS
    // this.filter2.quality = 30;
    
    // // Generate random number between .36 & .71
    // var filterValue = (Math.random() * (0.71 - 0.36) + 0.36).toFixed(2);
    // var filterValue2 = (Math.random() * (0 - 1) + 1).toFixed(2);
    
    // var minValue = 40;
    // var maxValue = this.context.sampleRate / 2;
    // // Logarithm (base 2) to compute how many octaves fall in the range.
    // var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
    // // Compute a multiplier from 0 to 1 based on an exponential scale.
    // var multiplier = Math.pow(2, numberOfOctaves * (filterValue - 1.0));
    // // Get back to the frequency value between min and max.
    // this.filter.frequency.value = maxValue * multiplier;


    // var minValue2 = 40;
    // var maxValue2 = this.context.sampleRate / 2;
    // // Logarithm (base 2) to compute how many octaves fall in the range.
    // var numberOfOctaves2 = Math.log(maxValue2 / minValue2) / Math.LN2;
    // // Compute a multiplier from 0 to 1 based on an exponential scale.
    // var multiplier2 = Math.pow(2, numberOfOctaves2 * (filterValue2 - 1.0));
    // // Get back to the frequency value between min and max.
    // this.filter2.frequency.value = maxValue2 * multiplier2;

    // this.sources[0].connect(this.filter);
    // this.sources[1].connect(this.filter2);
    // this.filter.connect(this.context.destination);
    // this.filter2.connect(this.context.destination);


  // }
  // else
  // {
    // if( this.filter != undefined )
    //   this.filter.disconnect(0);

    // if( this.filter2 != undefined )
    //   this.filter2.disconnect(0);
  // }

  this.gainNodes[0].gain.value = gain1;
  this.gainNodes[1].gain.value = gain2;
};

AudioManager.prototype.crossfadeBetweenSoundsWithValue = function(elements,value) {
  var x = parseInt(value) / parseInt(100);
  // Use an equal-power crossfading curve:
  var gain1 = Math.cos(x * 0.5*Math.PI);
  var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);

  this.gainNodes[elements[0]].gain.value = gain1;
  this.gainNodes[elements[1]].gain.value = gain2;
};

AudioManager.prototype.initCrossfade = function() {
  this.gainNodes[0].gain.value = 5;
  this.gainNodes[1].gain.value = 0;
};

AudioManager.prototype.bind = function(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}
