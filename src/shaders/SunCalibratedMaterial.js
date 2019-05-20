const THREE = AFRAME.THREE;
import fogReplace from './FogReplaceFrag.glsl';
import fogVertReplace from './FogReplaceVert.glsl';

import phongFrag from './PhongFrag.glsl';
import phongVert from './PhongVert.glsl';
import perlin from './PerlinNoise.glsl';

// sun calibrated materials need to have access to the sun system in order to properly update
// the sunCentroid parameter. must include sunCentroid and time uniform to work properly.
export default class SunCalibratedMaterial extends THREE.MeshPhongMaterial {
  constructor(system){
    super();
    this.onBeforeCompile = (shader) => {
      shader.uniforms.time = { value: 0 };
      shader.uniforms.sunCentroid = { value: new THREE.Vector3() };
      shader.uniforms.fadeOutTime = { value: 0 };
      shader.vertexShader = phongVert;
      shader.fragmentShader = phongFrag;
      this.shader = shader;
      system.registerMaterial(this.shader);
      // shader.vertexShader = perlin + shader.vertexShader;
      // shader.vertexShader = "uniform float opacity;\n" + shader.vertexShader;

      // shader.fragmentShader = shader.fragmentShader.replace(
      //   `#include <fog_fragment>`,
      //   fogReplace
      // );
      // shader.vertexShader = shader.vertexShader.replace(
      //   `#include <fog_vertex>`,
      //   fogVertReplace
      // );
    }
  }
}
