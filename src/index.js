import AFRAME from 'aframe';
import JSX from './JSX';
import './components/Spinner';
import './components/GroundMaterial'
import CameraRig from './CameraRig';


const App = () => (
  <a-scene background="color: black" fog="type: exponential; color: #daa05e; density: 0.05;">
    {CameraRig()}

    <a-assets>
      <a-asset-item id="mountains" src="assets/mountains/mountains.gltf" />
      <a-asset-item id="cubes" src="assets/cubes/cubes.gltf" />
    </a-assets>

    <a-sky color="#abca8d"></a-sky>

    <a-entity light="type: hemisphere; color: #ffffff; groundColor: #ffffff; intensity: 0.5" />
    <a-entity light="type: directional; color: #FFF; intensity: 1" position="-1 1 0" />


    <a-gltf-model
      src="#mountains"
      scale="0.06 0.1 0.06"
      ground-material="color: #da8f4b;"
    />
    <a-gltf-model
      src="#cubes"
      ground-material="color: #a98457;"
    />
  </a-scene>
);

document.querySelector('body').appendChild(App());
