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
        sunCentroid: {value: new THREE.Vector3(0,0,0)},
        sunRadius1: { value: 0 },
        sunRadius2: { value: 0 },
        sunRadius3: { value: 0 },
        skyRadius: { value: 0 },
        time: { value: 0 },
        env_c1: {value: new THREE.Color("#ecd8ab")},
        env_c2: {value: new THREE.Color("#f7dbb6")},
        heat_c1: {value: new THREE.Color("#f7967e")},
        heat_c2: {value: new THREE.Color("#f78f64")},
        night_c1: {value: new THREE.Color("#0d1a2f")},
        fogColor: {value: 0},
        fogDensity: {value: 0},
      },
      vertexShader: SkyVert,
      fragmentShader: SkyFrag,
      depthWrite: false,
      side: THREE.DoubleSide,
      fog: true,
    });

    var sky = new THREE.Mesh(sphereGeo, sphereMat);
    this.el.object3D.add(sky)
    this.sky = sky;
    system.registerSky(this.el);
    system.registerMaterial(this.sky.material);
  },
  tick: function (time, timeDelta) {
    this.sky.material.uniforms.time.value = time/1000;
  }
});
