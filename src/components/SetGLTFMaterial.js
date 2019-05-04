import AFRAME from 'aframe';
import GroundFrag from '../shaders/GroundFrag.glsl';
import GroundVert from '../shaders/GroundVert.glsl';

import SunCalibratedMaterial from '../shaders/SunCalibratedMaterial';

const THREE = AFRAME.THREE;

AFRAME.registerComponent('set-gltf-material', {
  schema: {
    color: {
      type: 'color',
      default: null
    }
  },
  init: function () {

    const system = document.querySelector('a-scene').systems['sunSystem'];

    this.material = new SunCalibratedMaterial(system);
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
  }
});
