import IntroFrag from '../shaders/IntroFrag.glsl';
import IntroVert from '../shaders/IntroVert.glsl';

import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('intro', {
  schema: {
  },

  init: function () {

    var planeMat = new THREE.ShaderMaterial({
      uniforms: {
        time: {value: 0},
        color2: {value: new THREE.Color("#000d27")},
        color1: {value: new THREE.Color("#000319")}
      },
      vertexShader: IntroVert, //lol
      fragmentShader: IntroFrag,
    });

    var planeGeo = new THREE.PlaneGeometry(20,20);
    var introPlane = new THREE.Mesh(planeGeo, planeMat);
    this.el.object3D.add(introPlane)
    this.introPlane = introPlane;
    this.introPlane.position.y = 2;

  },
  tick: function (time, timeDelta) {
    this.introPlane.material.uniforms.time.value = time;
  }
});
