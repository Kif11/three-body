import AFRAME from 'aframe';
import JSX from './JSX';
import './components/Spinner';
import './components/SetGLTFMaterial';
import './components/DefaultMaterial';
import './components/Sun';
import './components/Sky';
import './systems/SunSystem';

import CameraRig from './CameraRig';


const App = () => (
  <a-scene background="color: black" sunSystem="speed: 0.1; skyRadius: 1000; timeOffset:65000">
    {CameraRig()}

    <a-assets>
      <a-asset-item id="mountains" src="assets/mountains/mountains.gltf" />
      <a-asset-item id="cubes" src="assets/cubes/cubes.gltf" />
    </a-assets>

    <a-entity light="type: hemisphere; color: #ffffff; groundColor: #ffffff; intensity: 0.5" />
    <a-entity light="type: directional; color: #FFF; intensity: 1" position="-1 1 0" />
    <a-entity
     id="sky"
     sky
    />
    <a-entity
      sun="sunRadius:0.2; pathRadius:0.8; speed:-0.0002; offset:0.2"
    />
    <a-entity
      sun="sunRadius:0.06; pathRadius:0.8; speed:-0.004; offset:1"
    />
    <a-entity
      sun="sunRadius:0.1; pathRadius:0.8; speed:-0.006; offset:2"
    />
    <a-gltf-model
      src="#mountains"
      scale="0.5 0.5 0.5"
      set-gltf-material="color: #e2aa73;"
    />
    {/*
    <a-gltf-model
      src="#cubes"
      set-gltf-material="color: #a98457;"
    />
    */}
  </a-scene>
);

document.querySelector('body').appendChild(App());
