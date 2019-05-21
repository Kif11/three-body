import AFRAME from 'aframe';

import SunCalibratedMaterial from '../shaders/SunCalibratedMaterial';

const THREE = AFRAME.THREE;

AFRAME.registerComponent('set-gltf-material', {
  schema: {
    color: {
      type: 'color',
      default: null
    },
    castShadow: {
      type: 'boolean',
      default: false
    },
    receiveShadow: {
      type: 'boolean',
      default: false
    },
    collideWith: {
      type: 'boolean',
      default: false
    },
  },
  init: function () {

    const system = document.querySelector('a-scene').systems['sunSystem'];

    this.material = new SunCalibratedMaterial(system);
    const { color, collideWith } = this.data;
    this.el.addEventListener('model-loaded', () => {
      const scene = this.el.getObject3D('mesh');
      const mesh = scene.children[0];

      if (mesh) {
        mesh.castShadow = this.data.castShadow;
        mesh.receiveShadow = this.data.receiveShadow;
        mesh.geometry.computeVertexNormals()

        const { map: diffTexture } = mesh.material;

        if (diffTexture) {
          this.material.map = diffTexture;
        }

        mesh.material = this.material;

        if (color) {
          mesh.material.color = new THREE.Color(color);
        }

        // grab colliders from gltfs from kiko
        if(collideWith){
          if(!this.el.sceneEl.object3D.colliders) {
            this.el.sceneEl.object3D.colliders = [];
          }
          this.el.sceneEl.object3D.colliders.push(mesh);
        }
      }
    });
  },

  tick: function (time) {
  }
});
