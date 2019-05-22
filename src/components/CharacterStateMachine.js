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
export default class CharacterStateMachine {
  constructor(){
    this.state = 0;
  }
  getTargetPos(targetPos) {
    switch(this.state){
      case 0:
        //REACH USER
        var cameraEl = document.querySelector('#camera');
        var worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);
        var forward = new THREE.Vector3(0,0,1).transformDirection(cameraEl.object3D.matrixWorld)
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
          }, 1000);
          this.state += 1;
        } else {
          //try again
          ref.reachedCharacter = false;
        }

        break;

      case 2:
        ref.targetPos.set(60.74943, ref.characterHeight, 52.90357);
        ref.reachedCharacter = false;
        this.state += 1;
        break;

      case 3:
        ref.targetPos.set(55.74943, ref.characterHeight, 53.1357);
        ref.reachedCharacter = false;
        this.state += 1;
        break;
      case 4:
        //should be inside...
        if(ref.commentOver){
          ref.reachedCharacter = false;
          var cameraEl = document.querySelector('#camera');
          var camWorldPos = new THREE.Vector3();
          camWorldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);
          var distanceToShade = camWorldPos.distanceTo(new THREE.Vector3(60.74943, this.characterHeight, 52.90357));
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
