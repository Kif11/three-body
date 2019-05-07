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
      1000,
      widthSegments,
      heightSegments,
    );

    var sphereMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#70c1c3"),
      side: THREE.DoubleSide
    });

    var sky = new THREE.Mesh(sphereGeo, sphereMat);
    this.el.object3D.add(sky)
    this.sky = sky;
  },
  tick: function (time, timeDelta) {
  }
});
