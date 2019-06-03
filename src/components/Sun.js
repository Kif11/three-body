import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

import SunFrag from '../shaders/SunFrag.glsl';
import SunVert from '../shaders/SunVert.glsl';

AFRAME.registerComponent('sun', {
  schema: {
    sunRadius: {
      type: 'float',
      default: 0.2
    },
    pathRadius: {
      type: 'float',
      default: 0.8
    },
    speed: {
      type: 'float',
      default: -0.0002
    },
    offset: {
      type: 'float',
      default: 0.2
    }
  },
  init: function () {
    const system = document.querySelector('a-scene').systems['sunSystem'];

    const sphereMat = new THREE.ShaderMaterial({
      uniforms: {
        fadeOutTime: { value: 0 },
        sunCentroid: { value: 0 },
        time: { value: 0 },
      },
      vertexShader: SunVert,
      fragmentShader: SunFrag,
    });

    var sphereGeo = new THREE.SphereBufferGeometry(this.data.sunRadius * system.data.skyRadius, 100, 100);
    var sun = new THREE.Mesh(sphereGeo, sphereMat);
    this.el.object3D.add(sun)

    system.registerSun(this.el, this.data);
    system.registerMaterial(sphereMat);

  },
});
