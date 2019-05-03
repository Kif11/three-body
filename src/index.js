import AFRAME from 'aframe';
import aframeEffects from 'aframe-effects';
import JSX from './JSX';
import './components/Spinner';
import './components/SetGLTFMaterial';
import './components/DefaultMaterial';
import './components/Sun';
import './components/Sky';
import './components/Character';
import './components/SpeechController';
import './systems/SunSystem';

import CameraRig from './CameraRig';


const App = () => (
  <a-scene
    background="color: black"
    sunSystem="speed: .1; skyRadius: 1000; timeOffset:20000"
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
      <audio id="speech1" src="assets/greetingShort.mp3" preload="auto"></audio>
      <audio id="speech2" src="assets/speech1.mp3" preload="auto"></audio>
      <a-asset-item id="mountains" src="assets/mountains/mountains.gltf" />
      <a-asset-item id="cubes" src="assets/cubes/cubes.gltf" />
      <a-asset-item id="ruins" src="assets/ruins/ruins.gltf" />
    </a-assets>

    <a-entity light="type: hemisphere; color: #ffffff; groundColor: #ffffff; intensity: 0.5" />
    <a-entity id="sky" sky />

    <a-entity character sound="src: #bottle; volume: 1;"/>

    <a-entity
      speech-controller
      sound__1="
        src: #speech1;
        volume:3;
        loop: false;
        positional: true;
      "
      sound__2="
        src: #speech2;
        volume:3;
        loop: false;
        positional: true;
      "
    />

    <a-entity sun="sunRadius:0.2; pathRadius:0.8; speed:-0.002; offset:0.2" />
    <a-entity sun="sunRadius:0.06; pathRadius:0.8; speed:-0.004; offset:1" />
    <a-entity sun="sunRadius:0.1; pathRadius:0.8; speed:-0.006; offset:2" />

    <a-sphere color="yellow" radius="0.01" position="0 1 -4"  shadow="cast: true; receive: true" ></a-sphere>

    <a-gltf-model src="#ruins" position="5 0.44 -4" set-gltf-material />
    <a-gltf-model src="#mountains" scale="0.5 0.5 0.5" set-gltf-material="color: #e2aa73;" />
    {/* <a-gltf-model src="#cubes" set-gltf-material="color: #a98457;" /> */}
  </a-scene>
);

document.querySelector('body').appendChild(App());
