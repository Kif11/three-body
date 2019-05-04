import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

import SunCalibratedMaterial from '../shaders/SunCalibratedMaterial';

AFRAME.registerComponent('sun', {
  schema: {
    sunRadius: {
      type: 'float',
      default: 0.2
    },
    pathRadius: {
      type: 'float',
      default: 0.8
    },
    speed: {
      type: 'float',
      default: -0.0002
    },
    offset: {
      type: 'float',
      default: 0.2
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
