var audioMng;
window.onload = function()
{
	var muteHandler = document.getElementById('mute');
	// audioMng = new AudioManager(['./assets/audio/zic1.mp3','./assets/audio/zic2.mp3'], muteHandler);
	audioMng = new AudioManager(['./audio/twilight_by_stellardrone.mp3','./audio/zic2.mp3','./audio/thunder.mp3'], muteHandler);
	audioMng.init();
}