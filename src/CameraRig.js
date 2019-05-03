import AFRAME from 'aframe';
import JSX from './JSX';
import './components/Mover';

const CameraRig = () => (
  <a-entity id="cameraRig" position="0 0 4">
    <a-camera id="camera"/>
    <a-entity
      oculus-go-controls
      mover
    />
  </a-entity>
);

export default CameraRig;
