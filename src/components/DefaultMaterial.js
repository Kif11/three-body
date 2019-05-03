import AFRAME from 'aframe';
import MeshPhongMaterialOverride from '../shaders/MeshPhongMaterialOverride';
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
    mesh.material = new THREE.MeshPhongMaterialOverride();
    mesh.material.color = new THREE.Color(this.data.color);
  },

  tick: function (time, timeDelta) {
  }
});
