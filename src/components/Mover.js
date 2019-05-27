import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('mover', {
  schema: {
    speed: {
      type: 'int',
      default: 65
    }
  },

  init: function () {
    this.pressed = false;
    this.moveBackward = false;

    const rig = document.querySelector('#cameraRig');
    this.rig = rig.object3D;

    const camera = document.querySelector('a-camera');
    this.collider = this.el.components.collider;

    this.wasd = camera.getAttribute('wasd-controls');
    this.camera = camera.object3D;

    this.wasd.acceleration = this.data.speed;
    this.forward = true;

    const system = document.querySelector('a-scene').systems['sunSystem'];
    system.registerMainCharacter(this.camera);

    this.el.addEventListener('trackpaddown', () => {
      this.pressed = true;
    });
    this.el.addEventListener('trackpadup', () => {
      this.pressed = false;
    });
    this.el.addEventListener('triggerdown', () => {
      this.moveBackward = true;
      this.pressed = true;
    });
    this.el.addEventListener('triggerup', () => {
      this.moveBackward = false;
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
      tweenForward.y = 0;
      if (this.moveBackward){
        //move backwards
        var collided = this.collider.collide(true);
        if(!collided) {
          this.rig.position.sub(tweenForward.multiplyScalar(0.04))
        }
      } else {
        //move forwards
        var collided = this.collider.collide(false);
        if(!collided) {
          this.rig.position.add(tweenForward.multiplyScalar(0.04))
        }
      }
    } else {
      //handle web
      var collided = this.collider.collide(this.forward);
      this.wasd.enabled = !collided;
    }
  }
});
