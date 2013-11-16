(function() {
  window.onload = function() {
    var Building, Cfg, City, Cube, DarkGrey, Light, PI, PI2, Skybox, Themes, Utils, ambient, animateCam, ax, ay, breath0, breath1, camera, cameraAngle, circle, city, clearMask, composer, effect, effectFilm, effectFilmBW, effectHBlur, effectVBlur, effectVignette, friction, isAnimated, isTargeted, light, lightAngle, limit, limitAcc, moveCamera, music, plane, render, renderMaskInverse, renderModel, renderer, rotateLight, rtParams, scene, shaderVignette, targetPos, theme, themePos, vx, vy;
    Cfg = {
      LIGHT_SPEED: 0.0025,
      TRANSITION_TARGET_SPEED: 0.05,
      RADIUS: 245,
      CAMERA_Y: 500,
      CITY_COLOR: '#FFAA22',
      AMBIENT_COLOR: '#1A2024',
      SHADOW_BIAS: 0.0001,
      SHADOW_DARKNESS: 0.5,
      CUSTOM_COLORS: false
    };
    Themes = [
      {
        cityColor: '#FFFFFF',
        ambientColor: '#484848',
        cityRadius: 150,
        buildingsNumber: 50,
        cubesNumber: 0,
        cubeSize: 0
      }, {
        cityColor: '#FF2020',
        ambientColor: '#336464',
        cityRadius: 150,
        buildingsNumber: 50,
        cubesNumber: 10,
        cubeSize: 100
      }, {
        cityColor: '#21F2FF',
        ambientColor: '#417EA7',
        cityRadius: 150,
        buildingsNumber: 100,
        cubesNumber: 10,
        cubeSize: 50
      }, {
        cityColor: '#0069FF',
        ambientColor: '#212528',
        cityRadius: 50,
        buildingsNumber: 400,
        cubesNumber: 10,
        cubeSize: 150
      }, {
        cityColor: '#00FF77',
        ambientColor: '#231137',
        cityRadius: 200,
        buildingsNumber: 300,
        cubesNumber: 20,
        cubeSize: 100
      }, {
        cityColor: '#C365AC',
        ambientColor: '#3B2389',
        cityRadius: 250,
        buildingsNumber: 400,
        cubesNumber: 50,
        cubeSize: 200
      }, {
        cityColor: '#00FF96',
        ambientColor: '#162A16',
        cityRadius: 250,
        buildingsNumber: 500,
        cubesNumber: 50,
        cubeSize: 250
      }, {
        cityColor: '#FFA400',
        ambientColor: '#4A2C0A',
        cityRadius: 150,
        buildingsNumber: 50,
        cubesNumber: 20,
        cubeSize: 150
      }, {
        cityColor: '#FFAA22',
        ambientColor: '#20242A',
        cityRadius: 250,
        buildingsNumber: 600,
        cubesNumber: 50,
        cubeSize: 300
      }
    ];
    PI = Math.PI;
    PI2 = Math.PI * 2;
    city = null;
    ambient = null;
    plane = null;
    circle = null;
    light = null;
    ax = 0;
    vx = 0;
    ay = 0;
    vy = 0;
    friction = 0.93;
    limit = 0.05;
    limitAcc = 0.005;
    targetPos = new THREE.Vector3;
    cameraAngle = 0;
    lightAngle = 100;
    isTargeted = false;
    isAnimated = false;
    themePos = -1;
    theme = Themes[themePos];
    scene = new THREE.Scene;
    scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0020);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.y = 150;
    renderer = new THREE.WebGLRenderer({
      antialias: false
    });
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    clearMask = new THREE.ClearMaskPass();
    renderModel = new THREE.RenderPass(scene, camera);
    renderMaskInverse = new THREE.MaskPass(scene, camera);
    renderMaskInverse.inverse = true;
    effectHBlur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    effectVBlur = new THREE.ShaderPass(THREE.VerticalBlurShader);
    effectHBlur.uniforms['h'].value = 2 / (window.innerWidth / 2);
    effectVBlur.uniforms['v'].value = 2 / (window.innerHeight / 2);
    effectFilm = new THREE.FilmPass(0.05, 0, 0, false);
    effectFilmBW = new THREE.FilmPass(0.35, 0.5, 2048, true);
    shaderVignette = THREE.VignetteShader;
    effectVignette = new THREE.ShaderPass(shaderVignette);
    effectVignette.uniforms["offset"].value = 0.5;
    effectVignette.uniforms["darkness"].value = 1.6;
    effect = new THREE.ShaderPass(THREE.BleachBypassShader);
    effectFilm.renderToScreen = true;
    rtParams = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: true
    };
    composer = new THREE.EffectComposer(renderer, new THREE.WebGLRenderTarget(window.innerWidth, window.innerWidth, rtParams));
    composer.addPass(renderModel);
    composer.addPass(effectFilm);
    render = function() {
      requestAnimationFrame(render);
      rotateLight();
      moveCamera();
      return composer.render(0.01);
    };
    rotateLight = function() {
      lightAngle += Cfg.LIGHT_SPEED;
      light.position.x = 700 * Math.cos(lightAngle);
      light.position.z = 700 * Math.sin(lightAngle);
      return light.position.y = 500;
    };
    moveCamera = function() {
      if (!(isTargeted && (isAnimated || Utils.RadiusDetection(camera, circle)))) {
        ax = Math.max(Math.min(limitAcc, ax), -limitAcc);
        ax *= friction;
        vx *= friction;
        vx += ax;
        vx = Math.max(Math.min(limit, vx), -limit);
        cameraAngle += vx;
        camera.position.x = 1.5 * Cfg.RADIUS * Math.cos(cameraAngle);
        camera.position.z = 1.5 * Cfg.RADIUS * Math.sin(cameraAngle);
        ay = Math.max(Math.min(5, ay), -5);
        ay *= friction;
        vy *= friction;
        vy += ay;
        vy = Math.max(Math.min(5, vy), -5);
        if (camera.position.y < 5 || camera.position.y > 300) {
          vy = vy * -1;
        }
        camera.position.y += vy;
      }
      if (isTargeted || (!isTargeted && Utils.RadiusDetection(camera, circle))) {
        targetPos.x += (circle.position.x - targetPos.x) * Cfg.TRANSITION_TARGET_SPEED;
        targetPos.y += (circle.position.y - targetPos.y) * Cfg.TRANSITION_TARGET_SPEED;
        targetPos.z += (circle.position.z - targetPos.z) * Cfg.TRANSITION_TARGET_SPEED;
      } else {
        targetPos.x += (scene.position.x - targetPos.x) * Cfg.TRANSITION_TARGET_SPEED;
        targetPos.y += (scene.position.y - targetPos.y) * Cfg.TRANSITION_TARGET_SPEED;
        targetPos.z += (scene.position.z - targetPos.z) * Cfg.TRANSITION_TARGET_SPEED;
      }
      if (isTargeted && !Utils.RadiusDetection(camera, circle)) {
        ax += 0.05;
      } else if (isTargeted && Utils.RadiusDetection(camera, circle) && !isAnimated) {
        ax = 0;
        isAnimated = true;
        animateCam();
      }
      return camera.lookAt(targetPos);
    };
    animateCam = function() {
      return TweenMax.to(circle.position, 1, {
        x: plane.position.x,
        y: plane.position.y + 300,
        z: plane.position.z,
        ease: Expo.easeInOut,
        delay: 0.25,
        onStart: function() {
          breath1.stop().fadeIn(0.5, 1000);
          return breath1.play().fadeOut(0, 1000);
        },
        onComplete: function() {
          return TweenMax.to(camera.position, 1, {
            x: circle.position.x + 25,
            y: circle.position.y + 25,
            z: circle.position.z - 25,
            ease: Expo.easeInOut,
            delay: 0.5,
            onStart: function() {
              breath0.stop().fadeIn(0.5, 1000);
              return breath0.play().fadeOut(0, 1000);
            },
            onComplete: function() {
              scene.add(plane);
              return TweenMax.to(circle.position, 1, {
                y: -100,
                ease: Expo.easeInOut,
                delay: 0.25,
                onStart: function() {
                  breath1.stop().fadeIn(0.5, 1000);
                  return breath1.play().fadeOut(0, 1000);
                },
                onComplete: function() {
                  return TweenMax.to(camera.position, 0.5, {
                    delay: 0.25,
                    x: circle.position.x,
                    y: plane.position.y + 1,
                    z: circle.position.z,
                    ease: Expo.easeInOut,
                    onStart: function() {
                      breath0.stop().fadeIn(0.5, 1000);
                      return breath0.play().fadeOut(0, 1000);
                    },
                    onComplete: function() {
                      return DarkGrey.Scene.restart();
                    }
                  });
                }
              });
            }
          });
        }
      });
    };
    Utils = {
      map_range: function(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
      },
      RadiusDetection: function(obj1, obj2) {
        var obj1Angle, obj2Angle;
        obj1Angle = Math.atan2(obj1.position.z, obj1.position.x);
        obj2Angle = Math.atan2(obj2.position.z, obj2.position.x);
        return obj1Angle > obj2Angle - PI / 8 && obj1Angle < obj2Angle + PI / 8;
      }
    };
    Building = function(theme) {
      this.geometry = this.Geometry();
      return this.Mesh({
        radius: theme.cityRadius
      });
    };
    Building.prototype = {
      Geometry: function() {
        var geometry;
        geometry = new THREE.CubeGeometry(1, 1, 1);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
        return geometry;
      },
      Mesh: function(params) {
        var mesh, targetAngle;
        targetAngle = Math.random() * PI2;
        mesh = new THREE.Mesh(this.geometry);
        mesh.position.x = Math.cos(targetAngle) * (Math.random() + 0.1) * params.radius;
        mesh.position.z = Math.sin(targetAngle) * (Math.random() + 0.1) * params.radius;
        mesh.position.y = 0;
        mesh.scale.x = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
        mesh.scale.z = mesh.scale.x;
        mesh.scale.y = (Math.random() * Math.random() * Math.random() * mesh.scale.x) * 10 + 10;
        return mesh;
      }
    };
    Cube = function() {
      this.geometry = this.Geometry();
      return this.Mesh({
        cubeSize: theme.cubeSize
      });
    };
    Cube.prototype = {
      Geometry: function() {
        var geometry;
        geometry = new THREE.CubeGeometry(1, 1, 1);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -0.5, 0));
        return geometry;
      },
      Mesh: function(params) {
        var mesh, scale, targetAngle;
        targetAngle = Math.random() * PI2;
        mesh = new THREE.Mesh(this.geometry);
        mesh.position.x = Math.cos(targetAngle) * 600;
        mesh.position.z = Math.sin(targetAngle) * 600;
        mesh.position.y = 400 * Math.random() + 100;
        scale = Math.random() * Math.random() * params.cubeSize;
        mesh.scale.set(scale, scale, scale);
        mesh.rotation.x = Math.random() * PI2;
        mesh.rotation.y = Math.random() * PI2;
        mesh.rotation.z = Math.random() * PI2;
        return mesh;
      }
    };
    City = function(theme) {
      this.theme = theme;
      this.geometry = new THREE.Geometry;
      this.material = this.Material(theme.cityColor);
      this.generateCity();
      return this.Mesh();
    };
    City.prototype = {
      Material: function(color) {
        var matColor;
        matColor = new THREE.Color(color);
        return new THREE.MeshPhongMaterial({
          color: matColor.getHex()
        });
      },
      Mesh: function() {
        var mesh;
        mesh = new THREE.Mesh(this.geometry, this.material);
        mesh.scale.set(1, 1, 1);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
      },
      generateCity: function() {
        this.ground();
        this.buildings();
        return this.cubes();
      },
      buildings: function() {
        var building, circleColor, i, _results;
        i = 0;
        _results = [];
        while (i < this.theme.buildingsNumber) {
          building = new Building(this.theme);
          if (building.position.distanceTo(scene.position) > this.theme.cityRadius - 50 && !circle) {
            plane = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.MeshBasicMaterial({
              map: THREE.ImageUtils.loadTexture('images/portal.png'),
              wireframe: false,
              transparent: true
            }));
            plane.position.y = 2;
            plane.rotation.x = -PI / 2;
            circleColor = new THREE.Color(Cfg.CITY_COLOR);
            circle = new THREE.Mesh(new THREE.SphereGeometry(2.5, 100, 100), new THREE.MeshLambertMaterial({
              color: circleColor.getHex()
            }));
            circle.position.x = building.position.x;
            circle.position.z = building.position.z;
            circle.position.y = building.position.y + 100;
            circle.castShadow = true;
            scene.add(circle);
          }
          THREE.GeometryUtils.merge(this.geometry, building);
          _results.push(i++);
        }
        return _results;
      },
      cubes: function() {
        var cube, i, _results;
        i = 0;
        _results = [];
        while (i < this.theme.cubesNumber) {
          cube = new Cube(this.theme);
          THREE.GeometryUtils.merge(this.geometry, cube);
          _results.push(i++);
        }
        return _results;
      },
      ground: function() {
        var ground, groundGeometry, groundMaterial;
        groundGeometry = new THREE.PlaneGeometry(400, 400);
        groundGeometry.verticesNeedUpdate = true;
        groundMaterial = this.material;
        groundMaterial.ambiant = this.material;
        ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -PI / 2;
        ground.scale.set(100, 100, 100);
        ground.castShadow = true;
        ground.receiveShadow = true;
        return THREE.GeometryUtils.merge(this.geometry, ground);
      }
    };
    Light = {
      Ambient: function(color) {
        var ambientColor;
        ambientColor = new THREE.Color(color);
        ambient = new THREE.AmbientLight(ambientColor.getHex());
        return ambient;
      },
      Spot: function(color) {
        light = new THREE.SpotLight(0xFFFFFF, 4, 0, PI / 16, 500);
        light.position.set(0, Cfg.CAMERA_Y, 0);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadowCameraNear = 700;
        light.shadowCameraFar = camera.far;
        light.shadowCameraFov = 50;
        light.shadowBias = Cfg.SHADOW_BIAS;
        light.shadowDarkness = Cfg.SHADOW_DARKNESS;
        light.shadowCameraRight = 5;
        light.shadowCameraLeft = -5;
        light.shadowCameraTop = 5;
        light.shadowCameraBottom = -5;
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;
        return light;
      }
    };
    Skybox = function() {
      return this.Mesh();
    };
    Skybox.prototype = {
      Geometry: function() {
        return new THREE.CubeGeometry(10000, 10000, 10000);
      },
      Material: function() {
        return new THREE.MeshPhongMaterial({
          color: 0xd0e0f0,
          side: THREE.BackSide
        });
      },
      Mesh: function() {
        var mesh;
        mesh = new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000), new THREE.MeshPhongMaterial({
          color: 0xd0e0f0,
          side: THREE.BackSide
        }));
        return mesh;
      }
    };
    music = new Howl({
      urls: ['plane.mp3'],
      volume: 0.5,
      buffer: true,
      loop: true
    });
    breath0 = new Howl({
      urls: ['breath0.wav'],
      buffer: true,
      volume: 0.25
    });
    breath1 = new Howl({
      urls: ['wind.mp3'],
      buffer: true,
      volume: 0.25
    });
    DarkGrey = {
      Scene: {
        init: function() {
          var skybox;
          skybox = new Skybox();
          scene.add(skybox);
          light = new Light.Spot();
          return scene.add(light);
        },
        clean: function() {
          scene.remove(plane);
          scene.remove(circle);
          scene.remove(city);
          scene.remove(ambient);
          circle = null;
          return camera.lookAt(scene.position);
        },
        start: function() {
          camera.position.set(5000, 2000, 5000);
          isTargeted = false;
          isAnimated = false;
          themePos++;
          if (themePos >= Themes.length) {
            themePos = 0;
          }
          theme = Themes[themePos];
          Cfg.CITY_COLOR = Cfg.CUSTOM_COLORS ? Cfg.CITY_COLOR : theme.cityColor;
          Cfg.AMBIENT_COLOR = Cfg.CUSTOM_COLORS ? Cfg.AMBIENT_COLOR : theme.ambientColor;
          city = new City(theme);
          scene.add(city);
          ambient = new Light.Ambient(Cfg.AMBIENT_COLOR);
          scene.add(ambient);
          breath0.fadeOut(0, 2000, function() {
            return breath0.stop();
          });
          breath1.fadeOut(0, 2000, function() {
            return breath1.stop();
          });
          TweenMax.to(camera.position, 1.5, {
            y: 150
          });
          return TweenMax.to(Cfg, 1.5, {
            RADIUS: 245
          });
        },
        restart: function() {
          this.clean();
          return this.start();
        },
        render: function() {
          scene.add(light);
          return render();
        }
      },
      events: function() {
        return document.addEventListener('keydown', function(e) {
          if (!isTargeted) {
            if (e.keyCode === 37) {
              ax += 0.001;
            }
            if (e.keyCode === 39) {
              ax -= 0.001;
            }
            if (e.keyCode === 38) {
              ay += 0.05;
            }
            if (e.keyCode === 40) {
              ay -= 0.05;
            }
            if (e.keyCode === 32) {
              return isTargeted = true;
            }
          }
        });
      },
      initGui: function() {
        var gui;
        gui = new dat.GUI();
        gui.add(Cfg, 'TRANSITION_TARGET_SPEED', 0, 1).name('target speed').listen();
        gui.add(Cfg, 'LIGHT_SPEED', 0, 0.01).name('light speed').listen();
        gui.add(Cfg, 'RADIUS').name('Camera radius').listen();
        gui.addColor(Cfg, 'CITY_COLOR').name('City color').listen();
        gui.addColor(Cfg, 'AMBIENT_COLOR').name('Ambiant color').listen();
        gui.add(camera.position, 'y').name('Camera Y').listen();
        gui.add(Cfg, 'SHADOW_BIAS').name('Shadow bias');
        gui.add(Cfg, 'SHADOW_DARKNESS').name('Shadow darkness');
        gui.add(Cfg, 'CUSTOM_COLORS').name('custom colors');
        return gui.close();
      },
      init: function() {
        this.events();
        this.initGui();
        return this.Scene.init();
      }
    };
    DarkGrey.init();
    DarkGrey.Scene.start();
    return DarkGrey.Scene.render();
  };

}).call(this);
