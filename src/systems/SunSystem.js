import AFRAME from 'aframe';
const THREE = AFRAME.THREE;
import HazeFrag from '../shaders/HazeFrag.glsl';
import HazeVert from '../shaders/HazeVert.glsl';

AFRAME.registerSystem('sunSystem', {
  schema: {
    speed: {
      type: 'float'
    },
    skyRadius: {
      type: 'float'
    },
    timeOffset: {
      type: 'float',
      default: 0
    },
    fogColor: {
      type: 'color',
      default: '#ffffff'
    },
  },

  init: function () {
    this.entities = [];
    this.materials = [];
    this.center = new THREE.Object3D();
    this.center.up = new THREE.Vector3(1,0,1)
    this.sphere = new THREE.Sphere(new THREE.Vector3(0,0,0), this.data.skyRadius);
    this.ray = new THREE.Ray();

    //sun system is in charge of the three directional lights
    this.sunLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    this.sunLight1.castShadow = true;
    this.sunLight1.shadow.camera.far = 2*this.data.skyRadius;
    this.sunLight1.shadow.camera.left = -10;
    this.sunLight1.shadow.camera.bottom = -10;
    this.sunLight1.shadow.camera.right = 10;
    this.sunLight1.shadow.camera.top = 10;
    this.sunLight1.shadow.mapSize.width = 2*1024;
	  this.sunLight1.shadow.mapSize.height = 2*1024;

    // this.sceneEl.object3D.add(new THREE.CameraHelper(this.sunLight1.shadow.camera))

    this.sunLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    // this.sunLight2.castShadow = true;
    // this.sunLight2.shadow.camera.far = 2*this.data.skyRadius;

    this.sunLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
    // this.sunLight3.castShadow = true;
    // this.sunLight3.shadow.camera.far = 2*this.data.skyRadius;

    this.fogColor = new THREE.Color(this.data.fogColor);
    this.fogNightColor = new THREE.Color("#ffffff");

    this.sceneEl.object3D.add(this.sunLight1)
    this.sceneEl.object3D.add(this.sunLight2)
    this.sceneEl.object3D.add(this.sunLight3)

    //add haze plane
    var hazeMat = new THREE.ShaderMaterial({
      uniforms: {
        sunCentroid: {value: new THREE.Vector3(0,0,0)},
        fadeOutTime: {value: 0},
        hazeColor2: {value: new THREE.Color("#f7f5e7")},
        hazeColor1: {value: new THREE.Color("#ffcc00")},
        time: {value: 0},
      },
      side:THREE.DoubleSide,
      transparent: true,
      vertexShader: HazeVert,
      fragmentShader: HazeFrag,
      depthWrite: false,
    });

    var hazeGeo = new THREE.CylinderGeometry( 100, 100, 30, 32, null, true );
    this.haze = new THREE.Mesh(hazeGeo, hazeMat);
    this.haze.frustumCulled = false;
    this.haze.position.set(0,15,0);
    this.haze.scale.set(1,1,1);
    this.sceneEl.object3D.add(this.haze);
    this.registerMaterial(hazeMat);

    this.startAnimation = false;
    this.fadingOut = false;
    this.gameOver = false;

    this.animationTime = this.data.timeOffset;
    this.sceneEl.addEventListener('start-sun-animation', () => {
      this.startAnimation = true;
    });
    this.sceneEl.addEventListener('speech4-ended', () => {
      window.setTimeout(() => {
        if(!this.gameOver){
          this.fadingOut = true;
        }
      }, 40000);
    });
    this.sceneEl.addEventListener('win', () => {
      this.fadingOut = false;
      this.gameOver = true;
    });
  },

  registerSun: function (el, initData) {
    //TODO; WHY
    initData.sunRadius = this.data.skyRadius*parseFloat(initData.sunRadius);
    initData.pathRadius = this.data.skyRadius*parseFloat(initData.pathRadius);
    initData.speed = parseFloat(initData.speed);
    initData.offset = parseFloat(initData.offset);
    this.entities.push({el, initData});
    this.updateSkyUniforms();
  },

  updateSkyUniforms: function () {
    this.sky.material.uniforms["skyRadius"].value = this.data.skyRadius;
    this.entities.forEach((sun, index) => {
      const uniName = 'sunRadius' + (index+1).toString();
      this.sky.material.uniforms[uniName].value = sun.initData.sunRadius;
    })
  },

  registerSky: function (el) {
    this.sky = el.object3D.children[0];
  },

  registerMaterial: function(mat) {
    this.materials.push(mat);
  },

  registerMainCharacter: function(char) {
    this.sunLight1.target = char;
  },

  tick: function (time, timeDelta) {
    var center;
    if(this.startAnimation){
      if(this.animationTime > 174000 + 150000){
        this.animationTime += timeDelta;
      } else {
        this.animationTime += 2*timeDelta;
      }
    }

    center = new THREE.Vector3(0, this.data.skyRadius*Math.sin(this.animationTime/-2000*this.data.speed), this.data.skyRadius*Math.cos(this.animationTime/-2000*this.data.speed));

    this.center.position.copy(center);
    this.center.updateMatrixWorld();

    this.center.lookAt(new THREE.Vector3(0,0,0));
    var newX = new THREE.Vector3(1,0,0).applyQuaternion(this.center.quaternion);
    var newY = new THREE.Vector3(0,1,0).applyQuaternion(this.center.quaternion);

    var sunCentroid = new THREE.Vector3(0,0,0);
    this.entities.forEach((sun, index) => {
      const curSun = sun.el.object3D.children[0];
      var pos = new THREE.Vector3().add(
        newX.clone().multiplyScalar(sun.initData.pathRadius*Math.cos(this.animationTime*sun.initData.speed*this.data.speed + sun.initData.offset))).add(
        newY.clone().multiplyScalar(sun.initData.pathRadius*Math.sin(this.animationTime*sun.initData.speed*this.data.speed + sun.initData.offset)))
      pos.add(center);
      this.ray.origin.copy(pos);
      this.ray.direction.copy(pos.normalize().multiplyScalar(-1));
      this.ray.intersectSphere(this.sphere, curSun.position);
      const uniName = 'sunPos' + (index+1).toString();
      this.sky.material.uniforms[uniName].value.copy(curSun.position);
      const lightName = 'sunLight' + (index+1).toString();
      this[lightName].position.copy(curSun.position);
      this[lightName].intensity = Math.max(curSun.position.y/this.data.skyRadius, 0);
      sunCentroid.add(curSun.position)
    })

    sunCentroid.multiplyScalar(1/3);
    var t = sunCentroid.y/this.data.skyRadius;

    t = Math.min(Math.max(t, 0), 1)
    this.sceneEl.object3D.fog.density = Math.min(t+0.1,1)*0.005;
    this.sceneEl.object3D.fog.color = this.fogNightColor.lerp(this.fogColor, t)

    this.materials.forEach((mat) => {
      mat.uniforms.sunCentroid.value = sunCentroid;
      mat.uniforms.time.value = time/1000;
      if(this.fadingOut){
        mat.uniforms.fadeOutTime.value += 0.001;
        if (mat.uniforms.fadeOutTime.value > 1){
          this.sceneEl.emit('gameLose')
        }
      } else {
        mat.uniforms.fadeOutTime.value = Math.max(mat.uniforms.fadeOutTime.value-0.01, 0);
      }
    })
  }
});
