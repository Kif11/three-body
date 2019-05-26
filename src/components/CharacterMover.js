import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

import SunCalibratedMaterial from '../shaders/SunCalibratedMaterial';
import CharacterStateMachine from '../components/CharacterStateMachine';


//CONSTANTS
const CHARACTER_HEIGHT = -1;
const DEHYDRATED_BODY_POS = new THREE.Vector3(5.8, CHARACTER_HEIGHT, 13.8);
const PYRAMID_ENTRANCE_POS = new THREE.Vector3(32.25, CHARACTER_HEIGHT, 54.42);




const t1 = new THREE.Vector3();
const t2 = new THREE.Vector3();
const t3 = new THREE.Vector3();
const m1 = new THREE.Matrix4();
const UP = new THREE.Vector3(0,1,0);
//util
function setQuaternionFromDirection(direction, up, target) {
  const x = t1;
  const y = t2;
  const z = t3;
  const m = m1;
  const el = m1.elements;

  z.copy(direction);
  x.crossVectors(up, z);


  if (x.lengthSq() === 0) {
    // parallel
    if (Math.abs(up.z) === 1) {
      z.x += 0.0001;
    } else {
      z.z += 0.0001;
    }
    z.normalize();
    x.crossVectors(up, z);
  }

  x.normalize();
  y.crossVectors(z, x);

  el[0] = x.x; el[4] = y.x; el[8] = z.x;
  el[1] = x.y; el[5] = y.y; el[9] = z.y;
  el[2] = x.z; el[6] = y.z; el[10] = z.z;

  target.setFromRotationMatrix(m);
}
AFRAME.registerComponent('character-mover', {
  schema: {
  },

  init: function () {
    const system = document.querySelector('a-scene').systems['sunSystem'];

    this.targetPos = new THREE.Vector3(0, 1, -40);
    this.characterPos = new THREE.Vector3(0, CHARACTER_HEIGHT, -40);
    this.el.setAttribute('position', this.characterPos);
    this.targetQuat = new THREE.Quaternion();
    this.lookAtDir = new THREE.Vector3();

    this.walkingSpeed = 0.04;
    this.reachedCharacter = true;

    this.stateMachine = new CharacterStateMachine();

    // EVENT CHAIN 
    this.el.sceneEl.addEventListener('begin-game', (event) => {
      this.reachedCharacter = false;
    });
    this.el.sceneEl.addEventListener('speech1-ended', (event) => {
      window.setTimeout(() => {
        this.el.sceneEl.emit('speech2');
      }, 4000);
    });
    this.el.sceneEl.addEventListener('speech2-ended', (event) => {
      this.targetPos.copy(DEHYDRATED_BODY_POS);
      this.reachedCharacter = false;
      window.setTimeout(() => {
        this.el.sceneEl.emit('comment1');
      }, 4000);
    });
    this.el.sceneEl.addEventListener('comment1-ended', (event) => {
      this.commentOver = true;
    });
    this.el.sceneEl.addEventListener('speech3-ended', (event) => {
      //START THE PACING CYCLE
      this.walkingSpeed = 0.002;
      this.targetPos.copy(DEHYDRATED_BODY_POS);
      this.targetPos.x += 4*(Math.random()-0.5);
      this.reachedCharacter = false;
      window.setTimeout(() => {
        //TELLS USER TO RUN
        this.stateMachine.state = -1;
        this.el.sceneEl.emit('speech4');
      }, 36000);
      window.setTimeout(() => {
        //LOOK AT THE SKY
        this.stateMachine.state = 3;
        this.targetPos.set(this.characterPos.x ,CHARACTER_HEIGHT, DEHYDRATED_BODY_POS.z - 3);
      }, 34000);
    });
    this.el.sceneEl.addEventListener('speech4-ended', (event) => {
      this.walkingSpeed = 0.05;
      window.setTimeout(() => {
        this.stateMachine.state = 4;
        this.targetPos.copy(PYRAMID_ENTRANCE_POS);
        this.reachedCharacter = false;
      }, 3000);
      window.setTimeout(() => {
        this.el.sceneEl.emit('comment2');
        this.commentOver = false;
        document.querySelectorAll('.fire').forEach(el => el.emit('start-char-fire'))
      }, 6000);
    });
    this.el.sceneEl.addEventListener('speech5-ended', (event) => {
      window.setTimeout(() => {
        this.el.sceneEl.emit('gameOver');
      }, 10000);
    });
    this.el.sceneEl.addEventListener('comment2-ended', (event) => {
      this.commentOver = true;
    });
    this.el.sceneEl.addEventListener('win', (event) => {
      window.setTimeout(() => {
        this.el.sceneEl.emit('speechWin');
      }, 3000);
      window.setTimeout(() => {
        document.querySelectorAll('.fire').forEach(el => el.emit('stop-char-fire'))
      }, 7000);
    });
  },

  updateTargetPos: function () {
    this.characterPos.y = CHARACTER_HEIGHT;

    if(!this.reachedCharacter){
      this.stateMachine.getTargetPos(this.targetPos);
      this.lookAtDir.subVectors(this.targetPos, this.characterPos);
      //always face facePos
      setQuaternionFromDirection(this.lookAtDir.clone().normalize(), UP, this.targetQuat);
      var dist = this.lookAtDir.length();
      if(dist < 1) {
        this.reachedCharacter = true;
        this.stateMachine.updateState(this);
        return;
      }
      this.lookAtDir.multiplyScalar(this.walkingSpeed/dist);
      this.characterPos.add(this.lookAtDir)
      this.el.object3D.quaternion.slerp(this.targetQuat, 0.1);
    } else {
      //rotate to face user, when not facing a target
      var cameraEl = document.querySelector('#camera');
      var camWorldPos = new THREE.Vector3();
      camWorldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);
      camWorldPos.y = CHARACTER_HEIGHT;
      this.lookAtDir.subVectors(camWorldPos, this.characterPos);

      setQuaternionFromDirection(this.lookAtDir.normalize(), UP, this.targetQuat);
      this.el.object3D.quaternion.slerp(this.targetQuat, 0.1);
    }

  },

  tick: function (time, timeDelta) {
    this.updateTargetPos();

    // move character up and down
    var idx = 10*Math.sin(time/3000);
    this.characterPos.y = CHARACTER_HEIGHT + 1 + 0.1*Math.sin(idx)/idx;
    this.el.setAttribute('position', this.characterPos);
  }
});
