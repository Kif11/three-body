import AFRAME from 'aframe';
import GlowFrag from '../shaders/GlowFrag.glsl';
import GlowVert from '../shaders/GlowVert.glsl';

AFRAME.registerComponent('glow-material', {
  init: function () {
    const noiseTexture = new THREE.TextureLoader().load('/assets/tex_Fern_Lush_Noise.jpg');
    this.glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        noise: {
          value: noiseTexture
        },
        time: {
          value: 0
        }
      },
      vertexShader: GlowVert,
      fragmentShader: GlowFrag,
    });

    const mesh = this.el.object3D.children[0];
    mesh.material = this.glowMaterial;
  },

  tick: function (time, timeDelta) {
    this.glowMaterial.uniforms.time.value = time;
  }
});
