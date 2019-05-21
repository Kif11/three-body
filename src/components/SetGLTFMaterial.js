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
  },
  init: function () {

    const system = document.querySelector('a-scene').systems['sunSystem'];

    this.material = new SunCalibratedMaterial(system);
    const { color } = this.data;
    this.el.addEventListener('model-loaded', () => {
      const scene = this.el.getObject3D('mesh');
      const mesh = scene.children[0];

      // grab colliders from gltfs from kiko
      const boxg = new THREE.BoxGeometry(2,15,2);
      const boxMesh = new THREE.Mesh(boxg, new THREE.MeshBasicMaterial({wireframe:true}));
      this.el.setObject3D('colliders', boxMesh);

      if(!this.el.sceneEl.object3D.colliders) {
        this.el.sceneEl.object3D.colliders = [];
      }
      this.el.sceneEl.object3D.colliders.push(boxMesh);

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
      }
    });
  },

  tick: function (time) {
  }
});
