import SkyFrag from '../shaders/SkyFrag.glsl';
import SkyVert from '../shaders/SkyVert.glsl';

import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('sky', {
  schema: {
    widthSegments: {
      default: 30,
      type: 'int'
    },
    heightSegments: {
      default: 30,
      type: 'int'
    }
  },

  init: function () {
    const system = document.querySelector('a-scene').systems['sunSystem'];
    const { widthSegments, heightSegments } = this.data;

    var sphereGeo = new THREE.SphereBufferGeometry(
      system.data.skyRadius,
      widthSegments,
      heightSegments,
    );

    var sphereMat = new THREE.ShaderMaterial({
      uniforms: {
        sunPos1: { value: new THREE.Vector3(0,1,0) },
        sunPos2: { value: new THREE.Vector3(0,1,0) },
        sunPos3: { value: new THREE.Vector3(0,1,0) },
        sunRadius1: { value: 0 },
        sunRadius2: { value: 0 },
        sunRadius3: { value: 0 },
        skyRadius: { value: 0 },
        time: { value: 0 },
        env_c1: {value: new THREE.Color("#54cccc")},
        env_c2: {value: new THREE.Color("#2795bd")},
        heat_c1: {value: new THREE.Color("#fcf9bb")},
        heat_c2: {value: new THREE.Color("#ffb42e")},
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
    this.sky.material.uniforms.time.value = time/10;
  }
});
