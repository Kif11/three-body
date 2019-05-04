import AFRAME from 'aframe';
import SunCalibratedMaterial from '../shaders/SunCalibratedMaterial';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('default-material', {
  schema: {
    color: {
      type: 'color'
    },
    depthWrite: {
      type: 'boolean',
      default: 'true'
    }
  },
  init: function () {
    const mesh = this.el.object3D.children[0];
    mesh.material = new THREE.SunCalibratedMaterial();
    mesh.material.color = new THREE.Color(this.data.color);
  },

  tick: function (time, timeDelta) {
  }
});
