import AFRAME from 'aframe';
import GroundFrag from '../shaders/GroundFrag.glsl';
import GroundVert from '../shaders/GroundVert.glsl';

import MeshBasicMaterialOverride from '../shaders/MeshBasicMaterialOverride';

const THREE = AFRAME.THREE;

AFRAME.registerComponent('set-gltf-material', {
  schema: function () {
    color: {
      type: 'color'
    }
  },
  init: function () {
    this.material = new MeshBasicMaterialOverride();

    this.el.addEventListener('model-loaded', () => {
      const scene = this.el.getObject3D('mesh');
      const mesh = scene.children[0];

      if (mesh) {
        mesh.material = this.material;
        mesh.material.color = new THREE.Color(this.data.color);
      }
    });
  },

  tick: function (time) {
    // HACK: Using opacity to pass time
    this.material.opacity = time;
  }
});
