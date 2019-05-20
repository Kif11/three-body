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
        //REACH USER
        var cameraEl = document.querySelector('#camera');
        var worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);
        var back = new THREE.Vector3(0,0,-1).transformDirection(cameraEl.object3D.matrixWorld)
        worldPos.sub(back.normalize().multiplyScalar(1.5));
        targetPos.set(worldPos.x,-1,worldPos.z);
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
        window.setTimeout(() => {
          ref.el.sceneEl.emit('speech3');
        }, 500);
        this.state += 1;
        break;

      case 2:
        ref.reachedCharacter = false; //continuously follow character
        this.state += 1;
        break;

      case 3:
        ref.reachedCharacter = false; //continuously follow character
        //if we are in the shade.. then
        var distanceToShade = ref.characterPos.distanceTo(new THREE.Vector3(5, ref.characterHeight, -4));
        if(distanceToShade < 2){
          ref.el.sceneEl.emit('win');
        }
        break;
    }
  }
}
