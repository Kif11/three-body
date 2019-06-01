import FireRingFrag from '../shaders/FireRingFrag.glsl';
import FireRingVert from '../shaders/FireRingVert.glsl';

import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('ring-of-fire', {
  schema: {
  },

  init: function () {
    //add ring of fire cylinder
    var fireRingMat = new THREE.ShaderMaterial({
      uniforms: {
        sunCentroid: {value: new THREE.Vector3(0,0,0)},
        fadeOutTime: {value: -1},
        fireRingColor2: {value: new THREE.Color("#f7f5e7")},
        fireRingColor1: {value: new THREE.Color("#ffcc00")},
        time: {value: 0},
      },
      side:THREE.DoubleSide,
      transparent: true,
      vertexShader: FireRingVert,
      fragmentShader: FireRingFrag,
      depthWrite: false,
    });

    var fireRingGeo = new THREE.CylinderGeometry( 100, 100, 30, 32, null, true );
    var fireRing = new THREE.Mesh(fireRingGeo, fireRingMat);
    fireRing.frustumCulled = false;
    fireRing.position.set(0,15,0);
    fireRing.scale.set(1,1,1);
    this.el.object3D.add(fireRing);

    //register to be synced with sun parameters
    const system = document.querySelector('a-scene').systems['sunSystem'];
    system.registerMaterial(fireRingMat);
  },
  tick: function (time, timeDelta) {
  }
});
