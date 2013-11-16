define(['helpers/Resize', 'helpers/MathHelper', 'entities/Letter', 'entities/Attractor', 'entities/Particle', 'helpers/ColorHelper', 'data/GlobalSignals', 'data/GuiConstants', 'entities/Glitcher', 'helpers/AudioHelper', 'Howler', 'Stats', 'entities/TvScreen', 'dat'], function(Resize, MathHelper, Letter, Attractor, Particle, ColorHelper, GlobalSignals, GuiConstants, Glitcher, AudioHelper, Howler, Stats, TvScreen, dat) {

    var Playground = function()
    {
        // Renderer init
        this.canvas = document.createElement('canvas');
        this.canvas.width = Resize.screenWidth;
        this.canvas.height = Resize.screenHeight;
        this.canvas.id = "world";
        this.context = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        Resize.enableSmoothing(false);

        window.addEventListener('resize', this.onResize.bind(this));

        this.drawScalines();

        this.centerButton();
        var startButton = document.querySelector('#start p');
        TweenMax.to(startButton, 0.3, {opacity: 1, onComplete: function() {
                TweenMax.to(updater, 1, {run: 1, repeat: -1, onUpdate: function () {
                        TweenMax.to(startButton, 0, {opacity: 0.5 + Math.random() * 0.5});
                    }
                });
            }
        });
        var updater = {run: 0};
        startButton.addEventListener('click', this.onStartClicked.bind(this));
    };

    Playground.prototype = {
        centerButton: function() {
            var div = document.querySelector('#start');
            TweenMax.to(div, 0.4, {marginTop: - div.offsetHeight / 2, ease: Expo.easeInOut});
        },

        onStartClicked: function(e) {
            e.preventDefault();
            var button = document.querySelector('#start p');
            var div = document.querySelector('#start');
            button.removeEventListener('click', this.onStartClicked.bind(this));
            TweenMax.killTweensOf(button);

            var hideButtonTl = new TimelineMax({
                onComplete: function() {
                    TweenMax.to(button, 0, {display: 'none'});
                    this.bootstrap();
                }.bind(this)
            });
            hideButtonTl.gotoAndStop(0);

            var top = document.querySelector('#top');
            var bottom = document.querySelector('#bottom');

            hideButtonTl.insert(TweenMax.to(top, 0.4, {width: 0, ease: Cubic.easeOut}), 0);
            hideButtonTl.insert(TweenMax.to(bottom, 0.4, {width: 0, ease: Cubic.easeOut}), 0.2);
            hideButtonTl.insert(TweenMax.to(div, 0.4, {opacity: 0, ease: Cubic.easeOut}), 0.3);
            hideButtonTl.play();

        },

        bootstrap: function() {
            // Kick it !
            this.init();
            if(GuiConstants.showStats) {
                this.debug();
            }
            this.createGUI();
            this.initAudio();
            this.animate();
        },

        init: function()
        {
            this.trails = false;
            this.animationId = 0;
            this.endScreen = false;

            // Glitch init
            this.glitchNoises = [];
            var glitches = [1, 2, 3, 16, 17, 19, 20, 23, 24, 26, 29];
            var index;
            for(var i = 0; i < glitches.length; i++) {
                index = glitches[i] < 10 ? "0" + glitches[i] : glitches[i];
                this.glitchNoises[i] = "sounds/glitchs/" + index + ".mp3";
            }
            this.glitchTimer = 0;
            this.glitchBandTimer = 0;
            this.glitchBandInterval = 20;
            this.glitcher = new Glitcher(this.context, 0, 0, Resize.screenWidth, Resize.screenHeight);

            // Words init
            this.glitchTimer = 0;
            this.glitcher = new Glitcher(this.context, 0, 0, Resize.screenWidth, Resize.screenHeight);

            // Variables
            this.words = ["purple", "means", "disorder"];
            GuiConstants.letterWidth = GuiConstants.letterHeight = 90;
            GuiConstants.letterSpacing = 60;
            this.wordIndex = 0;
            this.letterGroup = [];

            // Map signal of letter morph completion
            this.addEvents();

            // Kick it
            this.createWord(this.words[this.wordIndex]);
        },

        initAudio: function() {
            this.audio = new AudioHelper();
            this.windAudio = new Howl({
                urls: ['sounds/ambiant-wind.mp3'],
                autoplay: true
            }).volume(GuiConstants.windVolume);
            this.windAudio.on('play', function() {
                this.windPlaying = true;
            }.bind(this));
            this.windAudio.on('pause', function() {
                this.windPlaying = false;
                this.windAudio.stop();
            }.bind(this));

            this.windPlaying = true;
            this.ambiant = new Howl({
                urls: ['sounds/ambiant-dark.mp3'],
                autoplay: false,
                loop: true
            });
            this.ambiant.on('play', function() {
                this.ambiantPlaying = true;
            }.bind(this));
            this.ambiant.on('pause', function() {
                this.ambiantPlaying = false;
                this.ambiant.stop();
            }.bind(this));
            this.ambiantPlaying = false;
        },

        playGlitchNoise: function(min, max) {
            min = min || 0;
            max = max || this.glitchNoises.length - 1;
            this.audio.load(this.glitchNoises[~~(MathHelper.rand(min, max))]);
        },

        resetEvents: function() {
            GlobalSignals.morphingCompleted.removeAll();
            GlobalSignals.trianglesAppeared.removeAll();
            GlobalSignals.textTransformCompleted.removeAll();
        },

        addEvents: function() {
            // Listen for word change
            GlobalSignals.morphingCompleted.addOnce(this.changeWord.bind(this));
            GlobalSignals.trianglesAppeared.addOnce(this.showText.bind(this));
            GlobalSignals.particlesAppeared.add(function() {
                this.windAudio.fadeOut(0, 1600);
                this.ambiant.play().volume(GuiConstants.ambiantVolume);
            }.bind(this));
        },

        showText: function() {
            this.wordsTl.play();
        },

        createWord: function(word) {
            var splitWord = word.split('');
            var startX = Resize.halfScreenWidth - (splitWord.length * (GuiConstants.letterWidth + GuiConstants.letterSpacing)) / 2;
            var startY = Resize.halfScreenHeight - GuiConstants.letterHeight;
            this.wordsTl = new TimelineMax({onComplete: this.changeWord.bind(this)});

            for(var i = 0; i < splitWord.length; i++) {
                this.letterGroup[i] = this.addLetter(splitWord[i], i, i * (GuiConstants.letterWidth + GuiConstants.letterSpacing) + startX, startY);
                this.wordsTl.insert(TweenMax.to(this.letterGroup[i], 2, {opacity: 1, ease: Cubic.easeInOut, onStart: function() {
                        this.playGlitchNoise();
                    }.bind(this)
                }), 0.55 * i);
            }

            // Speed up things a bit in debug mode
            if(GuiConstants.debug) this.wordsTl.timeScale(GuiConstants.timeScale);
            this.wordsTl.gotoAndStop(0);

            GlobalSignals.experimentStarted.dispatch();
        },

        changeWord: function() {
            this.resetEvents();

            this.glitchInterval = Math.max(1, 80 - 20 * this.wordIndex);

            this.setGlitchData();
            if(this.wordIndex >= this.words.length - 1) {
                this.endAnimation();
                return;
            }

            // Fetch next word
            var word = this.words[++this.wordIndex];
            var splitWord = word.split('');
            // console.log('[changeWord]', word, this.wordIndex + 1 + "/" + this.words.length);

            var startX = Resize.halfScreenWidth - (splitWord.length * (GuiConstants.letterWidth + GuiConstants.letterSpacing)) / 2;
            var startY = Resize.halfScreenHeight - GuiConstants.letterHeight;

            var timer = 2500;
            setTimeout(function() {
                this.removeUnusedLetters(splitWord);
                this.addMissingLetters(startX, startY, splitWord);

                // this.playGlitchNoise();
                this.audio.load('sounds/glitchs/34.mp3');
                this.morphCurrentWord(startX, startY, word);
                this.addEvents();
            }.bind(this), timer);
        },

        morphCurrentWord: function(x, y, word) {
            // console.log('[morphCurrentWord] Letters to morph:', word, word.length);
            for(var i = 0; i < word.length; i++) {
                this.letterGroup[i].morph(word[i], x + i * (GuiConstants.letterWidth + GuiConstants.letterSpacing), y);
            }
        },

        addMissingLetters: function(x, y, newWord) {
            for(var i = this.letterGroup.length; i < newWord.length; i++) {

                this.letterGroup[i] = new Letter(newWord[i], this.letterGroup[i - 1].position.x + 15, this.letterGroup[i - 1].position.y, GuiConstants.letterWidth, GuiConstants.letterHeight, i);
                this.letterGroup[i].opacity = 1;
                this.letterGroup[i] = new Letter(newWord[i], Resize.halfScreenWidth, Resize.halfScreenHeight, GuiConstants.letterWidth, GuiConstants.letterHeight, i);
                TweenMax.from(this.letterGroup[i].position, 1, {x: this.letterGroup[i].position.x - 50, y: this.letterGroup[i].position.y - 50, ease: Cubic.easeInOut});
                TweenMax.to(this.letterGroup[i], 1, {
                    opacity: 1,
                    delay: i * 0.04,
                    ease: Expo.easeInOut
                });
            }
        },

        removeUnusedLetters: function(newWord) {
            for(var i = newWord.length; i < this.letterGroup.length; i++) {
                this.removeLetter(i);
            }
        },

        addLetter: function(letter, index, x, y) {
            // console.log('[addLetter]', index, x, y);
            return new Letter(letter, x, y, GuiConstants.letterWidth, GuiConstants.letterHeight, index);
        },

        removeLetter: function(index) {
            // console.log('[removeLetter]', index);
            TweenMax.to(this.letterGroup[index], 0.5, {opacity: 0, ease: Expo.easeInOut, onComplete: function() {
                    this.letterGroup.splice(index, 1);
                }.bind(this)
            });
        },

        onResize: function() {
            // Update size singleton
            Resize.onResize();

            this.canvas.width = Resize.screenWidth;
            this.canvas.height = Resize.screenHeight;
        },

        explodeText: function() {
            // console.log('[explodeText]', GuiConstants.mass);
            this.resetEvents();

            var explodeTl = new TimelineMax({onUpdate: this.updateAttractorsMass.bind(this)});

            var duration = 4;
            explodeTl.insert(TweenMax.to(GuiConstants, duration, {mass: 120, onComplete: this.stopGlitch.bind(this)}), 0);
            explodeTl.insert(TweenMax.to(GuiConstants, duration, {mass: 0}), duration);

            explodeTl.play();

        },

        updateAttractorsMass: function() {
            for(var i = 0; i < this.letterGroup.length; i++) {
                for(var j = 0; j < this.letterGroup[i].letterPoints.length; j++) {
                    this.letterGroup[i].letterPoints[j].attractor.mass = GuiConstants.mass;
                }
            }
        },

        animate: function()
        {
            // Regular clear or no context clear
            if(this.trails) {
                this.context.fillStyle = "rgba(0, 0, 0, 0.05";
                this.context.fillRect(0, 0, Resize.screenWidth, Resize.screenHeight);
            }
            else {
                this.context.clearRect(0, 0, Resize.screenWidth, Resize.screenHeight);
            }


            if(GuiConstants.showStats) {
                this.stats.update();
            }

            // Show TV Static
            if(this.endScreen) {
                this.tvScreen.update(this.context);
            }
            // Show letters & glitches
            else {
                this.context.globalCompositeOperation = "lighter";

                // EXPERIMENT LOGIC
                for(var i = 0; i < this.letterGroup.length; i++) {
                    this.letterGroup[i].draw(this.context, Resize.halfScreenWidth, Resize.halfScreenHeight);
                }

                this.updateGlitchs();
            }


            this.animationId = requestAnimationFrame(this.animate.bind(this));
        },

        updateGlitchs: function() {
            if(this.glitcher) {
                if(this.glitchTimer++ >= this.glitchInterval) {
                    this.glitchTimer = 0;
                    this.playGlitchNoise();
                    this.glitcher.updateImage(this.context, 0, 0, Resize.screenWidth, Resize.screenHeight);
                    this.glitcher.glitch(this.context, 0, 0, Resize.screenWidth, Resize.screenHeight, 30);
                }
                if(this.glitchBand && this.glitchBandTimer++ >= this.glitchBandInterval) {
                    this.glitchBandTimer = 0;
                    this.glitcher.glitchFromData(this.context, 0, 0, this.glitchBand, Resize.halfScreenHeight - this.glitchBand.height, Math.random() > 0.5 ? 1 : 2);
                }
                this.drawScalines();
            }
        },

        stopGlitch: function() {
            TweenMax.to(this.canvas, 1.5, {opacity: 1, ease: Elastic.easeOut, onStart: function() {
                    this.bip.noteOff && this.bip.noteOff(0);
                    this.bip2.noteOff && this.bip2.noteOff(0);
                    this.bip.frequency.value = 0;
                    this.bip2.frequency.value = 0;
                    this.bip.disconnect();
                    this.bip2.disconnect();
                    this.tvScreen = new TvScreen();
                    this.endScreen = true;
                    this.trails = false;
                    TweenMax.to(this.canvas, 1.5, {overwrite: "all", opacity: 1});
                    TweenMax.to(this.tvScreen, 3, {opacity: 0.5});
                    this.tvNoise = new Howl({
                        urls: ['sounds/tv-static.mp3'],
                        autoplay: true,
                        loop: true
                    }).play().volume(1);
                    setTimeout(function() {
                        this.dispose();
                    }.bind(this), 2500);
                }.bind(this)
            });
        },

        setGlitchData: function() {
            if(this.wordIndex === 0) {
                this.glitchBand = this.context.getImageData(0, Resize.halfScreenHeight, Resize.screenWidth, 30);
            }
            else if(this.wordIndex == this.words.length - 1) {
                this.glitchData = this.context.getImageData(0, Resize.screenHeight >> 2, Resize.screenWidth, 60);
            }
        },

        drawScalines: function() {
            this.context.fillStyle = "#111";
            for(var i = 0; i < Resize.screenHeight; i+= 4) {
                this.context.fillRect(0, i, Resize.screenWidth, 1);
            }
        },

        endAnimation: function() {
            // console.log('[endAnimation]');
            this.ambiant.fadeOut(0, 1500);
            this.glitchInterval = 4;
            this.explodeText();

            // Delay the fuckup
            setTimeout(function() {
                this.bip = this.audio.createOscillator(400, this.bipVolume);
                this.bip2 = this.audio.createOscillator(100, this.bip2Volume);
                this.trails = true;
            }.bind(this), 2400);
        },

        dispose: function() {
            cancelAnimationFrame(this.animationId);
            var disposeTl = new TimelineMax({onComplete: function() {
                    Howler.Howler.mute();
                }
            });
            disposeTl.insert(TweenMax.to(this.canvas, 0.3, {scaleY: 0.01, backgroundColor: '#FFF', ease: Cubic.easeInOut}), 0);
            disposeTl.insert(TweenMax.to(this.canvas, 0.15, {scaleX: 0, ease: Cubic.easeInOut}), 0.3);
            disposeTl.play();
        },

        createGUI: function() {
            this.gui = new dat.GUI();
            this.gui.add(GuiConstants, 'drawAttractor');

            var letters = this.gui.addFolder("Letters");
            var widthUpdate = letters.add(GuiConstants, 'letterWidth').min(10).max(200);
            var heightUpdate = letters.add(GuiConstants, 'letterHeight').min(10).max(200);
            var spacingUpdate = letters.add(GuiConstants, 'letterSpacing').min(10).max(100);

            widthUpdate.onChange(function() {
                GlobalSignals.letterWidthChanged.dispatch();
            });

            heightUpdate.onChange(function(value) {
                // GlobalSignals.letterHeightChanged.dispatch();
                for(var i = 0; i < this.letterGroup.length; i++) {
                    this.letterGroup[i].height = value;
                    this.letterGroup[i].updateThreshold();
                }
            }.bind(this));

            spacingUpdate.onChange(function() {
                GlobalSignals.letterSpacingChanged.dispatch();
            });

            letters.open();

            var attractors = this.gui.addFolder("Attractors");
            var mass = attractors.add(GuiConstants, 'mass').min(0).max(50);
            var grav = attractors.add(GuiConstants, 'gravityConstant').min(0).max(10);

            mass.onChange(function(value) {
                for(var i = 0; i < this.letterGroup.length; i++) {
                    for(var j = 0; j < this.letterGroup[i].letterPoints.length; j++) {
                        this.letterGroup[i].letterPoints[j].attractor.mass = value;
                    }
                }
            }.bind(this));

            grav.onChange(function(value) {
                for(var i = 0; i < this.letterGroup.length; i++) {
                    for(var j = 0; j < this.letterGroup[i].letterPoints.length; j++) {
                        this.letterGroup[i].letterPoints[j].attractor.gravityConstant = value;
                    }
                }
            }.bind(this));

            attractors.open();

            setTimeout(function() {
                this.gui.close();
            }.bind(this), 1500);

            /*var sounds = this.gui.addFolder('Sound volume');
            var windD = sounds.add(GuiConstants, 'windVolume').min(0).max(1);
            var ambiantD = sounds.add(GuiConstants, 'ambiantVolume').min(0).max(1);
            sounds.add(GuiConstants, 'bipVolume').min(0).max(1);
            sounds.add(GuiConstants, 'bip2Volume').min(0).max(1);

            windD.onChange(function(value) {
                if(this.windPlaying) {
                    console.log('windPlaying?', this.windPlaying, value.toFixed(2));
                    this.windAudio.volume(value.toFixed(2));
                }
            }.bind(this));

            ambiantD.onChange(function(value) {
                if(this.ambiantPlaying) {
                    console.log('ambiantPlaying?', this.ambiantPlaying, value.toFixed(2));
                    this.ambiant.volume(value.toFixed(2));
                    this.ambiant.volume(value.toFixed(2));
                }
            }.bind(this));

            sounds.open();*/
        },

        debug: function() {
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            this.stats.domElement.style.zIndex = '10';

            document.body.appendChild( this.stats.domElement );
        }
    };

    return Playground;
});