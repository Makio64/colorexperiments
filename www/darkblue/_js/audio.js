
		// loadDogSound('./assets/audio/zic1.mp3');
window.onload = init;
var context;
var bufferLoader;
var buffers;
var source1, source2;
var i = 0;
function init() {

  var muteLink = document.getElementById('mute');
  muteLink.addEventListener( 'click', handleMute, false );

  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      './assets/audio/zic1.mp3',
      './assets/audio/zic2.mp3',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  buffers = bufferList;
  // Create two sources and play them both together.
  source1 = context.createBufferSource();
  source2 = context.createBufferSource();

  var gainNode = context.createGain();

  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];

  source1.loop = true;
  source2.loop = true;

  source1.connect(gainNode);
  source2.connect(gainNode);

  gainNode.connect(context.destination);

  source1.start(0);
  source2.start(0);
}

function handleMute()
{console.log('handel mute');
  if( i == 0)
  {
  source1.stop(0);
  source2.stop(0); i = 1;
  }
  else
  {
    finishedLoading(buffers);i = 0;
  }

  // this.source.stop ? this.source.stop(0) : this.source.noteOff(0);

  return false;
}

// CrossfadePlaylistSample.toggle = function() {
//   this.playing ? this.stop() : this.play();
//   this.playing = !this.playing;
// };