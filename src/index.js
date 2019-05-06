import AFRAME from 'aframe';

import JSX from './JSX';
import './components/Spinner';
import './components/SetGLTFMaterial';
import './components/SetCharacterMaterial';
import './components/DefaultMaterial';
import './components/Sun';
import './components/Sky';
import './components/CharacterMover';
import './components/SpeechController';
import './components/VertexCacheTextures';

import './systems/SunSystem';

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
      <audio id="speech1" src="assets/speech/greetingShort.mp3" preload="auto"></audio>
      <audio id="speech2" src="assets/speech/speech1.mp3" preload="auto"></audio>
      <a-asset-item id="mountains" src="assets/mountains/mountains.gltf" />
      <a-asset-item id="cubes" src="assets/cubes/cubes.gltf" />
      <a-asset-item id="ruins" src="assets/ruins/ruins.gltf" />
      <a-asset-item id="cliff" src="assets/cliff/cliff.gltf" />
      <a-asset-item id="mask" src="assets/mask/mask.gltf" />
      <a-asset-item id="fire" src="assets/fire_hi/fire_mesh.fbx" />
      <a-asset-item id="firePosExr" src="assets/fire_hi/fire_pos.exr" response-type="arraybuffer"/>
      <a-asset-item id="fireColorExr" src="assets/fire_hi/fire_col.exr" response-type="arraybuffer" />
      <a-asset-item id="fireParams" src="assets/fire_hi/fire_minmax.json" response-type="json"/>
    </a-assets>

    {/* <a-entity vertex-cache-textures="fbxModel:#fire; posTex:#firePosExr; colorTex:#fireColorExr; params:#fireParams" scale="0.01 0.01 0.01"></a-entity> */}

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

    <a-entity sun="sunRadius:0.2; pathRadius:0.8; speed:-0.002; offset:0.2" />
    <a-entity sun="sunRadius:0.06; pathRadius:0.8; speed:-0.004; offset:1" />
    <a-entity sun="sunRadius:0.1; pathRadius:0.8; speed:-0.006; offset:2" />

    {/* <a-sphere color="yellow" radius="0.01" position="0 1 -4"  shadow="cast: true; receive: true" ></a-sphere> */}

    <a-gltf-model src="#ruins" position="5 0.1 -4" set-gltf-material />
    <a-gltf-model src="#mountains" scale="0.5 0.1 0.5" set-gltf-material="color: #e2aa73;" />

    <a-gltf-model id="cliff1" rotation="0 -139.75185468374448 0" src="#cliff" position="76.8745 -5.17808 -101.02159" scale="1.01696 1.77721 1.6834" set-gltf-material="color: #e2aa73"></a-gltf-model>
    <a-gltf-model id="cliff2" rotation="0 10.34188820211136 0" src="#cliff" position="155.357 -0.93098 -35.56886" scale="1.5073 0.96664 2.1263" set-gltf-material="color: #e2aa73"></a-gltf-model>
    <a-gltf-model id="cliff3" rotation="179.9998479605043 62.488496010352975 -179.9998479605043" src="#cliff" position="11.33276 -1.21171 -203.52688" scale="0.63449 1.22352 1.05029" set-gltf-material="color: #e2aa73"></a-gltf-model>
    <a-gltf-model id="cliff4" rotation="0 -70.97113616726482 0" src="#cliff" position="-163.13671 -1.82796 -61.90092" scale="2.28821 1.39396 3.35915" set-gltf-material="color: #e2aa73"></a-gltf-model>
    <a-gltf-model id="cliff5" rotation="179.99927500270914 -85.17304103517253 179.99927500270914" src="#cliff" position="-86.8801 -1.82798 177.55686" scale="1.73741 1.19296 1.8559" set-gltf-material="color: #e2aa73"></a-gltf-model>
    <a-gltf-model id="cliff6" rotation="0 -70.97113616726482" src="#cliff" position="84.8113 -1.82796 217.52888" scale="2.28821 1.39396 3.35915" set-gltf-material="color: #e2aa73"></a-gltf-model>
    <a-gltf-model id="cliff7" rotation="0 19.987059725343638 0" src="#cliff" position="-437.62339 -1.82796 128.33767" scale="1.94443 1.19725 1.94443" set-gltf-material="color: #e2aa73"></a-gltf-model>

    {/* <a-gltf-model src="#cubes" set-gltf-material="color: #a98457;" /> */}
  </a-scene>
);

document.querySelector('body').appendChild(App());
