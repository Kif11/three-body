import AFRAME from 'aframe';
const THREE = AFRAME.THREE;
import { setQuaternionFromDirection } from '../libs/Utils';

import SunCalibratedMaterial from '../shaders/SunCalibratedMaterial';
import CharacterStateMachine from '../components/CharacterStateMachine';

//CONSTANTS
const CHARACTER_HEIGHT = -1;
const DEHYDRATED_BODY_POS = new THREE.Vector3(5.8, CHARACTER_HEIGHT, 13.8);
const PYRAMID_ENTRANCE_POS = new THREE.Vector3(32.25, CHARACTER_HEIGHT, 54.42);
const PENDULUM_POS = new THREE.Vector3(66.65371, CHARACTER_HEIGHT, -0.96281);

const UP = new THREE.Vector3(0,1,0);

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
      this.targetPos.copy(PENDULUM_POS);
      this.reachedCharacter = false;
    });
    this.el.sceneEl.addEventListener('speech4-ended', (event) => {
      //START THE PACING CYCLE
      this.walkingSpeed = 0.002;
      this.targetPos.copy(PENDULUM_POS);
      this.targetPos.x += 4*(Math.random()-0.5);
      this.reachedCharacter = false;
      window.setTimeout(() => {
        //TELLS USER TO RUN
        this.stateMachine.state = -1;
        this.el.sceneEl.emit('speech6');
      }, 36000);
      window.setTimeout(() => {
        //LOOK AT THE SKY
        this.stateMachine.state = 4;
        this.targetPos.set(this.characterPos.x ,CHARACTER_HEIGHT, DEHYDRATED_BODY_POS.z - 3);
      }, 34000);
      window.setTimeout(() => {
        const psystem = document.querySelector('a-scene').systems['pendulum'];
        const synch = psystem.getSynchStatus();
        if(synch) {
          this.el.sceneEl.emit('speech5');
        } else {
          this.el.sceneEl.emit('speech7');
        }
        //speech 5
      }, 18000);
    });

    this.el.sceneEl.addEventListener('speech6-ended', (event) => {
      this.walkingSpeed = 0.05;
      window.setTimeout(() => {
        this.stateMachine.state = 5;
        this.targetPos.copy(PYRAMID_ENTRANCE_POS);
        this.reachedCharacter = false;
      }, 3000);
      window.setTimeout(() => {
        this.el.sceneEl.emit('comment2');
        this.commentOver = false;
        document.querySelectorAll('.fire').forEach(el => el.emit('start-char-fire'))
      }, 6000);
    });

    // this.el.sceneEl.addEventListener('speech3-ended', (event) => {
    //   //START THE PACING CYCLE
    //   this.walkingSpeed = 0.002;
    //   this.targetPos.copy(DEHYDRATED_BODY_POS);
    //   this.targetPos.x += 4*(Math.random()-0.5);
    //   this.reachedCharacter = false;
    //   window.setTimeout(() => {
    //     //TELLS USER TO RUN
    //     this.stateMachine.state = -1;
    //     this.el.sceneEl.emit('speech4');
    //   }, 36000);
    //   window.setTimeout(() => {
    //     //LOOK AT THE SKY
    //     this.stateMachine.state = 3;
    //     this.targetPos.set(this.characterPos.x ,CHARACTER_HEIGHT, DEHYDRATED_BODY_POS.z - 3);
    //   }, 34000);
    // });
    // this.el.sceneEl.addEventListener('speech4-ended', (event) => {
    //   this.walkingSpeed = 0.05;
    //   window.setTimeout(() => {
    //     this.stateMachine.state = 4;
    //     this.targetPos.copy(PYRAMID_ENTRANCE_POS);
    //     this.reachedCharacter = false;
    //   }, 3000);
    //   window.setTimeout(() => {
    //     this.el.sceneEl.emit('comment2');
    //     this.commentOver = false;
    //     document.querySelectorAll('.fire').forEach(el => el.emit('start-char-fire'))
    //   }, 6000);
    // });
    this.el.sceneEl.addEventListener('speechWin-ended', (event) => {
      window.setTimeout(() => {
        this.el.sceneEl.emit('gameWin');
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
