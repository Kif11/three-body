import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

const PENDULUM_POS = new THREE.Vector3(34, -1, -19);

AFRAME.registerComponent('mover', {
  schema: {
    speed: {
      type: 'int',
      default: 65
    }
  },

  init: function () {
    this.pressed = false;
    this.lastAxis = new THREE.Vector2();
    this.vrMovingSpeed = 0.0039;

    const rig = document.querySelector('#cameraRig');
    this.rig = rig.object3D;

    const camera = document.querySelector('#camera');
    this.collider = this.el.components.collider;

    this.wasd = camera.getAttribute('wasd-controls');
    this.camera = camera.object3D;

    this.wasd.acceleration = this.data.speed;
    this.forward = true;

    const system = document.querySelector('a-scene').systems['sunSystem'];
    system.registerMainCharacter(this.camera);

    this.raycasterSystem = document.querySelector('a-scene').systems['raycasterSystem'];

    this.el.addEventListener('trackpaddown', () => {
      this.pressed = true;
    });
    this.el.addEventListener('trackpadup', () => {
      this.pressed = false;
    });

    this.el.addEventListener('axismove', (evt) => {
      this.lastAxis.x = evt.detail.axis[0];
      this.lastAxis.y = evt.detail.axis[1];
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
      //move forwards
      var collided = this.collider.collide(true);
      if(!collided) {
        this.rig.position.sub(tweenForward.multiplyScalar(this.vrMovingSpeed*timeDelta))
      }
      var dist = this.rig.position.distanceTo(PENDULUM_POS);
      if(dist < 20){
        //enable laser
        this.raycasterSystem.laserPlane.visible = true;
      } else {
        //disable laser
        this.raycasterSystem.laserPlane.visible = false;
      }
    } else {
      //handle web
      var collided = this.collider.collide(this.forward);
      this.wasd.enabled = !collided;
    }
  }
});
