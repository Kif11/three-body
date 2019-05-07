import AFRAME from 'aframe';

import JSX from './JSX';
import './components/SetGLTFMaterial';
import './components/Sky';
import './components/VertexCacheTextures';

import CameraRig from './CameraRig';


const App = () => (
  <a-scene
    stats
    background="color: black"
    sunSystem="speed: .1; skyRadius: 1000; timeOffset:60000"
    renderer="
      antialias: true;
      physicallyCorrectLights: true;
      colorManagement: true;
      foveationLevel: 3;
      shadowMapEnabled: true;
    "
  >
    {CameraRig()}
    <a-assets>
      <a-asset-item id="mountains" src="assets/mountains/mountains.gltf" />
      <a-asset-item id="ruins" src="assets/ruins/ruins.gltf" />
      <a-asset-item id="fire" src="assets/fire_hi/fire_mesh.fbx" />
      <a-asset-item id="firePosExr" src="assets/fire_hi/fire_pos.exr" response-type="arraybuffer"/>
      <a-asset-item id="fireColorExr" src="assets/fire_hi/fire_col.exr" response-type="arraybuffer" />
      <a-asset-item id="fireParams" src="assets/fire_hi/fire_minmax.json" response-type="json"/>
      <a-asset-item id="cloth" src="assets/cloth/cloth_mesh.fbx" />
      <a-asset-item id="clothPosExr" src="assets/cloth/cloth_pos.exr" response-type="arraybuffer"/>
      <a-asset-item id="clothNormalExr" src="assets/cloth/cloth_norm.exr" response-type="arraybuffer" />
      <a-asset-item id="clothParams" src="assets/cloth/cloth_minmax.json" response-type="json"/>
      <img id="clothDiffuse" src="assets/cloth/cloth_diffuse.png"/>
    </a-assets>

     <a-entity vertex-cache-textures="fbxModel:#fire; posTex:#firePosExr; colorTex:#fireColorExr; params:#fireParams;" position="2.2 1 -2" scale="0.01 0.01 0.01" ></a-entity>
     <a-entity vertex-cache-textures="fbxModel:#cloth; posTex:#clothPosExr; normalTex:#clothNormalExr; diffuseTex:#clothDiffuse; params:#clothParams; mode:'soft';" position="-2.2 -2 -2" scale="0.02 0.02 0.02"></a-entity>

    <a-entity light="type: hemisphere; color: #ffffff; groundColor: #ffffff; intensity: 0.5" />
    <a-entity id="sky" sky />

    <a-gltf-model
      src="#mask"
      set-character-material="color: #ffffff;"
      character-mover
      speech-controller
      sound__1="
        src: #speech1;
        volume:1;
        loop: false;
        positional: true;
      "
      sound__2="
        src: #speech2;
        volume:1;
        loop: false;
        positional: true;
      "
    />
    <a-gltf-model src="#mountains" scale="0.5 0.1 0.5" set-gltf-material="color: #e2aa73;" />
  </a-scene>
);

document.querySelector('body').appendChild(App());
