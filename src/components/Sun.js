import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('sun', {
  schema: {
    sunRadius: {
      type: 'int',
      default: 10
    },
    pathRadius: {
      type: 'int',
      pathRadius: 800
    },
    speed: {
      type: 'int',
      default: 1000
    },
    offset: {
      type: 'int',
      default: 0
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
