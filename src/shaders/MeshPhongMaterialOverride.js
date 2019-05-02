const THREE = AFRAME.THREE;
import fogReplace from './FogReplaceFrag.glsl';
import fogVertReplace from './FogReplaceVert.glsl';

import phongFrag from './PhongFrag.glsl';
import phongVert from './PhongVert.glsl';
import perlin from './PerlinNoise.glsl';

export default class MeshPhongMaterialOverride extends THREE.MeshPhongMaterial {
  constructor(){
    super();

    this.onBeforeCompile = function (shader) {

      shader.vertexShader = phongVert;
      shader.fragmentShader = phongFrag;


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
