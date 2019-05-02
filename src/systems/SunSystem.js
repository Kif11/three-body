import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

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
  },

  init: function () {
    this.entities = []
    this.center = new THREE.Object3D();
    this.center.up = new THREE.Vector3(1,0,1)
    this.sphere = new THREE.Sphere(new THREE.Vector3(0,0,0), this.data.skyRadius);
    this.ray = new THREE.Ray();

    //sun system is in charge of the three directional lights
    this.sunLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    this.sunLight1.castShadow = true;
    this.sunLight1.shadow.camera.far = 2*this.data.skyRadius;

    this.sunLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    this.sunLight2.castShadow = true;
    this.sunLight2.shadow.camera.far = 2*this.data.skyRadius;

    this.sunLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
    this.sunLight3.castShadow = true;
    this.sunLight3.shadow.camera.far = 2*this.data.skyRadius;


    this.sceneEl.object3D.add(this.sunLight1)
    this.sceneEl.object3D.add(this.sunLight2)
    this.sceneEl.object3D.add(this.sunLight3)

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

  tick: function (time, timeDelta) {
    var animationTime = time + this.data.timeOffset;
    var center = new THREE.Vector3(0, this.data.skyRadius*Math.sin(animationTime/-2000*this.data.speed), this.data.skyRadius*Math.cos(animationTime/-2000*this.data.speed));
    this.center.position.copy(center);
    this.center.updateMatrixWorld();

    this.center.lookAt(new THREE.Vector3(0,0,0));
    var newX = new THREE.Vector3(1,0,0).applyQuaternion(this.center.quaternion);
    var newY = new THREE.Vector3(0,1,0).applyQuaternion(this.center.quaternion);

    this.entities.forEach((sun, index) => {
      const curSun = sun.el.object3D.children[0];
      var pos = new THREE.Vector3().add(
        newX.clone().multiplyScalar(sun.initData.pathRadius*Math.cos(animationTime*sun.initData.speed*this.data.speed + sun.initData.offset))).add(
        newY.clone().multiplyScalar(sun.initData.pathRadius*Math.sin(animationTime*sun.initData.speed*this.data.speed + sun.initData.offset)))
      pos.add(center);
      this.ray.origin.copy(pos);
      this.ray.direction.copy(pos.normalize().multiplyScalar(-1));
      this.ray.intersectSphere(this.sphere, curSun.position);
      const uniName = 'sunPos' + (index+1).toString();
      this.sky.material.uniforms[uniName].value.copy(curSun.position);
      const lightName = 'sunLight' + (index+1).toString();
      this[lightName].position.copy(curSun.position);
      // this[lightName].position.normalize();
    })
  }
});
