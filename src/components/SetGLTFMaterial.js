import AFRAME from 'aframe';
import GroundFrag from '../shaders/GroundFrag.glsl';
import GroundVert from '../shaders/GroundVert.glsl';

import MeshBasicMaterialOverride from '../shaders/MeshBasicMaterialOverride';

const THREE = AFRAME.THREE;

AFRAME.registerComponent('set-gltf-material', {
  schema: {
    color: {
      type: 'color',
      default: null
    }
  },
  init: function () {
    const { color } = this.data;
    this.material = new MeshBasicMaterialOverride();

    this.el.addEventListener('model-loaded', () => {
      const scene = this.el.getObject3D('mesh');
      const mesh = scene.children[0];

      if (mesh) {
        const { map: diffTexture } = mesh.material;

        if (diffTexture) {
          this.material.map = diffTexture;
        }

        mesh.material = this.material;
        
        if (color) {
          mesh.material.color = new THREE.Color(color);
        }
      }
    });
  },

  tick: function (time) {
    // HACK: Using opacity to pass time
    this.material.opacity = time;
  }
});
