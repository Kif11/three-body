import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('sun', {
  schema: function () {
    sunRadius: {
      type: 'float'
    }
    pathRadius: {
      type: 'float'
    }
    speed: {
      type: 'float'
    }
    offset: {
      type: 'float'
    }
  },
  init: function () {
    const system = document.querySelector('a-scene').systems['sunSystem'];

    var sphereGeo = new THREE.SphereBufferGeometry(this.data.sunRadius * system.data.skyRadius);
    var sphereMat = new THREE.MeshBasicMaterial({color: new THREE.Color()});
    var sun = new THREE.Mesh(sphereGeo, sphereMat);
    this.el.object3D.add(sun)

    system.registerSun(this.el, this.data);
  },
});
