import AFRAME from 'aframe';
import MeshBasicMaterialOverride from '../shaders/MeshBasicMaterialOverride';
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
    mesh.material = new MeshBasicMaterialOverride();
    mesh.material.depthWrite = this.data.depthWrite;
    mesh.material.color = new THREE.Color(this.data.color);
    mesh.material.side = THREE.DoubleSide;
  },

  tick: function (time, timeDelta) {
  }
});
