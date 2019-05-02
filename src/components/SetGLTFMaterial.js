import AFRAME from 'aframe';
import GroundFrag from '../shaders/GroundFrag.glsl';
import GroundVert from '../shaders/GroundVert.glsl';

import MeshPhongMaterialOverride from '../shaders/MeshPhongMaterialOverride';

const THREE = AFRAME.THREE;

AFRAME.registerComponent('set-gltf-material', {
  schema: {
    color: {
      type: 'color',
      default: null
    }
  },
  init: function () {
    this.material = new MeshPhongMaterialOverride();
    const { color } = this.data;
    this.el.addEventListener('model-loaded', () => {
      const scene = this.el.getObject3D('mesh');
      const mesh = scene.children[0];

      if (mesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.geometry.computeVertexNormals()
        
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
