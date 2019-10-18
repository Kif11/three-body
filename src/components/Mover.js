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
    this.pressedQuest = false;
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

    /*
      Oculus touch controller events
    */
    this.el.addEventListener('thumbsticktouchstart', (evt) => {
      this.pressedQuest = true;
    })
    this.el.addEventListener('thumbsticktouchend', (evt) => {
      this.pressedQuest = false;
    })
  },

  tick: function (time, timeDelta) {
    if(this.pressed){
      const tweenForward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.camera.quaternion);
      this.handleMove(tweenForward, timeDelta);
    } else if (this.pressedQuest){
      const tweenForward = new THREE.Vector3(-this.lastAxis.x, 0, -this.lastAxis.y).applyQuaternion(this.camera.quaternion);
      this.handleMove(tweenForward, timeDelta);
    } else {
      //handle web
      const collided = this.collider.collide(this.forward);
      this.wasd.enabled = !collided;
    }
  },

  handleMove: function (move, timeDelta){
    move.y = 0;
    const collided = this.collider.collide(true);
    if (!collided) {
      this.rig.position.sub(move.multiplyScalar(this.vrMovingSpeed * timeDelta))
    }
    const dist = this.rig.position.distanceTo(PENDULUM_POS);
    if (dist < 20) {
      debugger;
      // enable laser
      this.raycasterSystem.laserPlane.visible = true;
    } else {
      // disable laser
      this.raycasterSystem.laserPlane.visible = false;
    }
  }
});
