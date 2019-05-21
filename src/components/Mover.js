import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('mover', {
  init: function () {
    this.pressed = false;
    this.lastAxis = new THREE.Vector2();
    const rig = document.querySelector('#cameraRig');
    this.rig = rig.object3D;

    const camera = document.querySelector('a-camera');
    this.collider = this.el.components.collider;

    this.wasd = camera.getAttribute('wasd-controls');
    this.camera = camera.object3D;

    // this.colliderSystem = document.querySelector('a-scene').systems['collider'];

    const system = document.querySelector('a-scene').systems['sunSystem'];
    system.registerMainCharacter(this.camera);

    this.el.addEventListener('axismove', (evt) => {
      this.lastAxis.x = evt.detail.axis[0];
      this.lastAxis.y = evt.detail.axis[1];
    });
    this.el.addEventListener('trackpaddown', (evt) => {
      this.pressed = true;
    });
    this.el.addEventListener('trackpadup', (evt) => {
      this.pressed = false;
    });
  },
  tick: function (time, timeDelta) {
    var collided = this.collider.collide();
    //handle web
    this.wasd.enabled = !collided;
    //handle vr
    if(this.pressed && !collided){
      const tweenForward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.camera.quaternion);
      if(this.lastAxis.y < 0){
        //move backwards
        this.rig.position.sub(tweenForward.multiplyScalar(0.03))
      } else {
        //move forwards
        this.rig.position.add(tweenForward.multiplyScalar(0.03))
      }
    }
  }
});
