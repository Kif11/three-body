import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('mover', {
  init: function () {
    this.moveForward = false;
    this.moveBackward = false;

    const rig = document.querySelector('#cameraRig');
    this.rig = rig.object3D;

    const camera = document.querySelector('a-camera');
    this.collider = this.el.components.collider;

    this.wasd = camera.getAttribute('wasd-controls');
    this.camera = camera.object3D;

    this.wasd.acceleration = 150;
    // this.colliderSystem = document.querySelector('a-scene').systems['collider'];

    const system = document.querySelector('a-scene').systems['sunSystem'];
    system.registerMainCharacter(this.camera);

    this.el.addEventListener('trackpaddown', () => {
      this.moveForward = true;
    });
    this.el.addEventListener('trackpadup', () => {
      this.moveForward = false;
    });
    this.el.addEventListener('triggerdown', () => {
      this.moveBackward = true;
    });
    this.el.addEventListener('triggerup', () => {
      this.moveBackward = false;
    });
  },
  tick: function (time, timeDelta) {
    var collided = this.collider.collide();
    //handle web
    this.wasd.enabled = !collided;
    //handle vr
    if(!collided){
      const tweenForward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.camera.quaternion);
      if (this.moveBackward){
        //move backwards
        this.rig.position.sub(tweenForward.multiplyScalar(0.03))
      } else if (this.moveForward) {
        //move forwards
        this.rig.position.add(tweenForward.multiplyScalar(0.03))
      }
    }
  }
});
