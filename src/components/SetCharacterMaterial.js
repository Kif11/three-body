import AFRAME from 'aframe';
import GroundFrag from '../shaders/GroundFrag.glsl';
import GroundVert from '../shaders/GroundVert.glsl';

import SunCalibratedMaterial from '../shaders/SunCalibratedMaterial';
import EyeFrag from '../shaders/EyeFrag.glsl';
import EyeVert from '../shaders/EyeVert.glsl';

const THREE = AFRAME.THREE;

AFRAME.registerComponent('set-character-material', {
  schema: {
    color: {
      type: 'color',
      default: null
    }
  },
  init: function () {

    const system = document.querySelector('a-scene').systems['sunSystem'];

    this.eyeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: EyeVert,
      fragmentShader: EyeFrag,
    });

    this.material = new SunCalibratedMaterial(system);
    const { color } = this.data;
    this.el.addEventListener('model-loaded', () => {
      const scene = this.el.getObject3D('mesh');
      const eyeMesh = scene.getObjectByName('eyes');
      const bodyMesh = scene.getObjectByName('body');

      if (eyeMesh) {
        eyeMesh.material = this.eyeMaterial;
      }
      if (bodyMesh) {
        const { map: diffTexture } = bodyMesh.material;

        if (diffTexture) {
          this.material.map = diffTexture;
        }
        bodyMesh.geometry.computeVertexNormals();
        bodyMesh.material = this.material;
      }
    });
  },

  tick: function (time) {
    this.eyeMaterial.uniforms.time.value = time/1000;
  }
});
