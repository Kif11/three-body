import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('sun', {
  schema: function () {
    sunRadius: {
      type: 'int'
    }
    pathRadius: {
      type: 'int'
    }
    speed: {
      type: 'int'
    }
    offset: {
      type: 'int'
    }
  },
  init: function () {
    var sphereGeo = new THREE.SphereBufferGeometry(this.data.sunRadius);
    var sphereMat = new THREE.MeshBasicMaterial({});
    var sun = new THREE.Mesh(sphereGeo, sphereMat);
    this.el.object3D.add(sun)

    const system = document.querySelector('a-scene').systems['sunSystem'];
    system.registerSun(this.el, this.data);
  },
});
