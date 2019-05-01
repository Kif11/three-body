import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerSystem('sunSystem', {
  schema: {
    speed: {
      type: 'float'
    },
    skyRadius: {
      type: 'int'
    },
  },

  init: function () {
    this.entities = []
    this.center = new THREE.Object3D();
    this.center.up = new THREE.Vector3(1,0,1)
    this.sphere = new THREE.Sphere(new THREE.Vector3(0,0,0), this.data.skyRadius);
    this.ray = new THREE.Ray();
  },

  registerSun: function (el, initData) {
    //TODO; WHY
    initData.sunRadius = parseFloat(initData.sunRadius);
    initData.pathRadius = parseFloat(initData.pathRadius);
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
    var center = new THREE.Vector3(0, this.data.skyRadius*Math.sin(time/-2000*this.data.speed), this.data.skyRadius*Math.cos(time/-2000*this.data.speed));
    this.center.position.copy(center);
    this.center.updateMatrixWorld();

    this.center.lookAt(new THREE.Vector3(0,0,0));
    var newX = new THREE.Vector3(1,0,0).applyQuaternion(this.center.quaternion);
    var newY = new THREE.Vector3(0,1,0).applyQuaternion(this.center.quaternion);

    this.entities.forEach((sun, index) => {
      const curSun = sun.el.object3D.children[0];
      var pos = new THREE.Vector3().add(
        newX.clone().multiplyScalar(sun.initData.pathRadius*Math.cos(time*sun.initData.speed*this.data.speed + sun.initData.offset))).add(
        newY.clone().multiplyScalar(sun.initData.pathRadius*Math.sin(time*sun.initData.speed*this.data.speed + sun.initData.offset)))
      pos.add(center);
      this.ray.origin.copy(pos);
      this.ray.direction.copy(pos.normalize().multiplyScalar(-1));
      this.ray.intersectSphere(this.sphere, curSun.position);
      const uniName = 'sunPos' + (index+1).toString();
      this.sky.material.uniforms[uniName].value.copy(curSun.position);
    })
  }
});
