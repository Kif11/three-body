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
  <a-scene background="color: black" sunSystem="speed: 10; skyRadius: 500">
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
      sun="sunRadius:100; pathRadius:800; speed:-100; offset:100"
    />
    <a-entity
      sun="sunRadius:30; pathRadius:800; speed:-1000; offset:2000"
    />
    <a-entity
      sun="sunRadius:50; pathRadius:800; speed:-600; offset:40"
    />
    <a-gltf-model
      src="#mountains"
      scale="0.5 0.5 0.5"
      set-gltf-material="color: #e2aa73;"
    />
    <a-gltf-model
      src="#cubes"
      set-gltf-material="color: #a98457;"
    />
  </a-scene>
);

document.querySelector('body').appendChild(App());
