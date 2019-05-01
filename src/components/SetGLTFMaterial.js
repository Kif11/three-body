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
    // this.material = new THREE.ShaderMaterial({
    //   uniforms: {
    //     time: { value: 0.0 },
    //     flowTexture: { value: 0.0 },
    //   },
    //   vertexShader: GroundVert,
    //   fragmentShader: GroundFrag,
    // });

    this.material = new MeshBasicMaterialOverride();

    this.el.addEventListener('model-loaded', () => {
      const scene = this.el.getObject3D('mesh');
      const mesh = scene.children[0];

      if (mesh) {
        // this.material.uniforms.flowTexture.value = mesh.material.map;

        mesh.material = this.material;
        console.log('mesh.material', mesh.material);

        mesh.material.color = new THREE.Color(this.data.color);
      }
    });
  },

  tick: function (time) {
    this.material.opacity = time;
  }
});
