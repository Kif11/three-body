import SkyFrag from '../shaders/SkyFrag.glsl';
import SkyVert from '../shaders/SkyVert.glsl';

import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('sky', {
  schema: function () {
  },
  init: function () {
    const system = document.querySelector('a-scene').systems['sunSystem'];

    var sphereGeo = new THREE.SphereBufferGeometry(system.data.skyRadius);

    var sphereMat = new THREE.ShaderMaterial({
      uniforms: {
        sunPos1: { value: new THREE.Vector3(0,1,0) },
        sunPos2: { value: new THREE.Vector3(0,1,0) },
        sunPos3: { value: new THREE.Vector3(0,1,0) },
        sunRadius1: { value: 0 },
        sunRadius2: { value: 0 },
        sunRadius3: { value: 0 },
        skyRadius: { value: 0 },
      },
      vertexShader: SkyVert,
      fragmentShader: SkyFrag,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    var sky = new THREE.Mesh(sphereGeo, sphereMat);
    this.el.object3D.add(sky)
    this.sky = sky;
    system.registerSky(this.el);
  },
  tick: function (time, timeDelta) {
  }
});
