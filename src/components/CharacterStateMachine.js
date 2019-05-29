const THREE = AFRAME.THREE;
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

//CONSTANTS
const CHARACTER_HEIGHT = -1;
const DEHYDRATED_BODY_POS = new THREE.Vector3(5.8, CHARACTER_HEIGHT, 13.8);
const WIN_POS = new THREE.Vector3(60.74943, CHARACTER_HEIGHT, 52.90357);
export default class CharacterStateMachine {
  constructor(){
    this.state = 0;
    this.camera = document.querySelector('#camera');
    this.tmps = {
      v1: new THREE.Vector3(),
      v2: new THREE.Vector3(),
    }
  }
  getTargetPos(targetPos) {
    switch(this.state){
      case 0:
        //REACH USER
        var worldPos = this.tmps.v1.setFromMatrixPosition(this.camera.object3D.matrixWorld);
        var forward = this.tmps.v2.set(0,0,1).transformDirection(this.camera.object3D.matrixWorld)
        worldPos.sub(forward.normalize().multiplyScalar(1.5));
        targetPos.set(worldPos.x,-1,worldPos.z);
        break;
      case 1:
      break;
      case 3:
      break;
    }
  }
  updateState(ref) {
    switch(this.state){
      case 0:
        ref.el.sceneEl.emit('speech1');
        this.state += 1;
        break;

      case 1:
        //if comment 1 is over then start speech3
        if(ref.commentOver){
          window.setTimeout(() => {
            ref.el.sceneEl.emit('speech3');
          }, 5000);
          window.setTimeout(() => {
            ref.el.sceneEl.emit('start-sun-animation');
          }, 10);
          this.state += 1;
        } else {
          //try again
          ref.reachedCharacter = false;
        }
        break;

      case 2:
        //keep generating new targets, never update state
        ref.targetPos.copy(DEHYDRATED_BODY_POS);
        ref.targetPos.x += 4*(Math.random()-0.5);
        ref.reachedCharacter = false;
      break;

      case 3:
      break;

      case 4:
        ref.targetPos.set(60.74943, CHARACTER_HEIGHT, 52.90357);
        ref.reachedCharacter = false;
        this.state += 1;
        break;

      case 5:
        ref.targetPos.set(55.74943, CHARACTER_HEIGHT, 53.1357);
        ref.reachedCharacter = false;
        this.state += 1;
        break;
      case 6:
        //should be inside...
        if(ref.commentOver){
          ref.reachedCharacter = false;
          var camWorldPos = this.tmps.v1.setFromMatrixPosition(this.camera.object3D.matrixWorld);
          camWorldPos.setFromMatrixPosition(this.camera.object3D.matrixWorld);
          var distanceToShade = camWorldPos.distanceTo(WIN_POS);
          if(distanceToShade < 10){
            ref.el.sceneEl.emit('win');
            ref.reachedCharacter = true;
          }
        } else {
          ref.reachedCharacter = false;
        }
        break;
    }
  }
}
