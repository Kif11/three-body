import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

import SunCalibratedMaterial from '../shaders/SunCalibratedMaterial';
import CharacterStateMachine from '../components/CharacterStateMaching';

AFRAME.registerComponent('character-mover', {
  schema: {
  },

  init: function () {
    const system = document.querySelector('a-scene').systems['sunSystem'];

    this.characterHeight = -1;
    this.targetPos = new THREE.Vector3(0, 1, -40);
    this.characterPos = new THREE.Vector3(0, this.characterHeight, -40);
    this.el.setAttribute('position', this.characterPos);

    this.walkingSpeed = 0.3;
    this.reachedCharacter = true;
    this.eventTick = [0,0,0,0];

    /** SEQUENCER BASED ON EVENTS
    REACH USER
    BEGIN SPEECH 1 (greeting)
    BEGIN SPEECH 2 (history) AND TRIGGER FOLLOW
    REACH DEHYDRATED BODY
    BEGIN SPEECH 3 (dehydration) AND TRIGGER FOLLOW
    REACH SUN DIAL
    BEGIN SPEECH 4 (prediction)
    BEGIN SPEECH 5 (find shade)
    REACH SHELTER, OR BURN
    **/
    this.el.sceneEl.addEventListener('begin-game', (event) => {
      this.reachedCharacter = false;
    });
    this.el.sceneEl.addEventListener('speech1-ended', (event) => {
      window.setTimeout(() => {
        this.el.sceneEl.emit('speech2');
      }, 500);
    });
    this.el.sceneEl.addEventListener('speech2-ended', (event) => {
      this.targetPos.set(10,this.characterHeight,10);
      this.reachedCharacter = false;
    });
    this.el.sceneEl.addEventListener('speech3-ended', (event) => {
      window.setTimeout(() => {
        this.el.sceneEl.emit('speech4');
      }, 500);
    });
    this.el.sceneEl.addEventListener('speech4-ended', (event) => {
      //now set to following camera. if ever reaches shade.. trigger happy ending
      this.reachedCharacter = false;
      this.eventTick[3]=1;
    });
  },

  handleEventSequence: function () {
    if(this.eventTick[0]==0){
      this.el.sceneEl.emit('speech1');
      this.eventTick[0]=1;
    } else if(this.eventTick[2]==0){
      //wait a few moments and then starts speech 3
      window.setTimeout(() => {
        this.el.sceneEl.emit('speech3');
      }, 500);
      this.eventTick[2]=1;
    } else if(this.eventTick[3]==1){
      this.reachedCharacter = false; //continuously follow character
    }
  },
  updateTargetPos: function () {
    //only first event has variable target pos
    if(this.eventTick[0]==0 || this.eventTick[3]==1){
      var cameraEl = document.querySelector('#camera');
      var worldPos = new THREE.Vector3();
      worldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);

      var forward = new THREE.Vector3(0,0,1).transformDirection(cameraEl.object3D.matrixWorld)
      worldPos.sub(forward.normalize().multiplyScalar(1.5));
      this.targetPos.set(worldPos.x,this.characterHeight,worldPos.z);
    }

    this.characterPos.y = this.characterHeight;

    var dir = new THREE.Vector3().subVectors(this.targetPos, this.characterPos);
    var dist = dir.length();
    if(dist < 1) {
      this.reachedCharacter = true;
      this.handleEventSequence();
      return;
    }
    dir.multiplyScalar(this.walkingSpeed/dist);
    this.characterPos.add(dir)
  },

  tick: function (time, timeDelta) {
    if(!this.reachedCharacter) {
      this.updateTargetPos()
    }
    var idx = 10*Math.sin(time/3000);
    this.characterPos.y = this.characterHeight + 1 + 0.1*Math.sin(idx)/idx;
    this.el.setAttribute('position', this.characterPos);

    if(this.eventTick[3]==1){
      //if we are in the shade.. then
      var distanceToShade = this.characterPos.distanceTo(new THREE.Vector3(5, this.characterHeight, -4));
      if(distanceToShade < 2){
        this.el.sceneEl.emit('win');
        console.log('win')
      }
    }
  }
});
