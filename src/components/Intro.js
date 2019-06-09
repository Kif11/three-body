import IntroFrag from '../shaders/IntroFrag.glsl';
import IntroVert from '../shaders/IntroVert.glsl';

import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('intro', {
  init: function () {
    const planeMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color("#000319") },
      },
      vertexShader: IntroVert, //lol
      fragmentShader: IntroFrag,
    });

    const planeGeo = new THREE.PlaneGeometry(20,20);
    const introPlane = new THREE.Mesh(planeGeo, planeMat);
    this.el.object3D.add(introPlane)
    this.introPlane = introPlane;
  },

  tick: function (time, timeDelta) {
    this.introPlane.material.uniforms.time.value = time;
  }
});
