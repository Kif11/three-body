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

    this.wasd.acceleration = 350;
    this.forward = true;

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
    window.addEventListener('keydown', (evt) => {
      if(evt.key == 'w'){
        this.forward = true;
      }
      if(evt.key == 's'){
        this.forward = false;
      }
    });
  },
  tick: function (time, timeDelta) {
    //handle vr
    if(this.pressed){
      const tweenForward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.camera.quaternion);
      if(this.lastAxis.y < 0){
        //move backwards
        var collided = this.collider.collide(false);
        if(!collided) {
          this.rig.position.sub(tweenForward.multiplyScalar(0.03))
        }
      } else {
        //move forwards
        var collided = this.collider.collide(true);
        if(!collided) {
          this.rig.position.add(tweenForward.multiplyScalar(0.03))
        }
      }
    } else {
      //handle web
      var collided = this.collider.collide(this.forward);
      this.wasd.enabled = !collided;
    }
  }
});
