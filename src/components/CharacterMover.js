import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

import SunCalibratedMaterial from '../shaders/SunCalibratedMaterial';

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

    this.el.sceneEl.addEventListener('begin-game', (event) => {
      this.reachedCharacter = false;
    });

    this.el.sceneEl.addEventListener('speech1-ended', (event) => {
      //come follow me?
      this.targetPos.set(10,this.characterHeight,10);
      this.reachedCharacter = false;
      // window.setTimeout(() => {
      //   this.el.sceneEl.emit('speech2');
      // }, 5000);
    });
    this.el.sceneEl.addEventListener('speech2-ended', (event) => {
      window.setTimeout(() => {
        this.el.sceneEl.emit('speech3');
      }, 5000);
    });
    this.el.sceneEl.addEventListener('speech3-ended', (event) => {
      window.setTimeout(() => {
        this.el.sceneEl.emit('speech4');
      }, 5000);
    });
  },

  updateTargetPos: function () {
    var cameraEl = document.querySelector('#camera');
    var worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);

    var forward = new THREE.Vector3(0,0,1).transformDirection(cameraEl.object3D.matrixWorld)
    worldPos.sub(forward.normalize().multiplyScalar(1.5));
    if(this.eventTick[0]==0){
      this.targetPos.set(worldPos.x,this.characterHeight,worldPos.z);
    }
    this.characterPos.y = this.characterHeight;

    var dir = new THREE.Vector3().subVectors(this.targetPos, this.characterPos);
    var dist = dir.length();
    console.log(dist)
    if(dist < 1) {
      if(this.eventTick[0]==0){
        this.el.sceneEl.emit('speech1');
        this.eventTick[0]=1;
      } else if(this.eventTick[1]==0){
        console.log('hi')
        this.el.sceneEl.emit('speech2');
        this.eventTick[1]=1;
      }
      this.reachedCharacter = true;
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
  }
});
