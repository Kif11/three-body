import AFRAME from 'aframe';
import JSX from './JSX';

const Fire = (id, position, rotation, scale, offset, fps) => (
  <a-entity
    class="fire"
    id={id}
    position={position}
    rotation={rotation}
    scale="0 0 0"
    animation__start={`
      property: scale;
      to: ${scale};
      dur: 5000;
      easing: linear;
      startEvents: start-char-fire;
    `}
    animation__stop="
      property: scale;
      to: 0 0 0;
      startEvents: stop-char-fire;
      dur: 5000;
      easing: linear;
    "
    vertex-cache-textures={`
      fps: ${fps};
      offset: ${offset};
      params: assets/fire/fire_minmax.json;
      fbxModel: assets/fire/fire_mesh.fbx;
      posTex: assets/fire/fire_pos.exr;
      colorTex: assets/fire/fire_col.exr
    `}
  />
)

export default Fire;
