const THREE = AFRAME.THREE;
import fogReplace from './FogReplaceFrag.glsl';
import fogVertReplace from './FogReplaceVert.glsl';

import phongFrag from './PendulumFrag.glsl';
import phongVert from './PendulumVert.glsl';

// sun calibrated materials need to have access to the sun system in order to properly update
// the sunCentroid parameter. must include sunCentroid and time uniform to work properly.
export default class PendulumMaterial extends THREE.MeshPhongMaterial {
  constructor(system, color){
    super();
    if(color){
      this.color = color;
    }
    this.onBeforeCompile = (shader) => {
      shader.uniforms.time = { value: 0 };
      shader.uniforms.sunCentroid = { value: new THREE.Vector3() };
      shader.uniforms.fadeOutTime = { value: -1 };
      shader.uniforms.glow = { value: 0 };
      shader.uniforms.glowColor = { value: new THREE.Color("#c7c4b9") };

      shader.vertexShader = phongVert;
      shader.fragmentShader = phongFrag;
      this.shader = shader;
      system.registerMaterial(this.shader);
    }
  }
}
