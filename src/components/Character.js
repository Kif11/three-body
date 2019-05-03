import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('character', {
  schema: {
  },

  init: function () {
    var boxGeo = new THREE.BoxBufferGeometry(0.25,1,0.15);
    var boxMat = new THREE.MeshPhongMaterial({color: new THREE.Color('#454340')});
    var character = new THREE.Mesh(boxGeo, boxMat);
    character.position.set(0,this.characterHeight,-40)
    this.el.object3D.add(character)
    this.character = character;
    this.characterHeight = 0.7;
    this.targetPos = new THREE.Vector3(0,1,-40);
    this.walkingSpeed = 0.1;

    this.reachedCharacter = false;

    this.el.sceneEl.addEventListener('speech1', (event) => {
      this.character.material.color = new THREE.Color('#ff00ff')
    });
    this.el.sceneEl.addEventListener('speech1-ended', (event) => {
      //wait for a few minutes and then start speech 2
      console.log('speech ended')
      window.setTimeout(() => {
        this.el.sceneEl.emit('speech2');
      }, 5000);

    });
  },

  updateTargetPos: function () {
    var cameraEl = document.querySelector('#camera');
    var worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);
    var forward = new THREE.Vector3(0,0,1).transformDirection(cameraEl.object3D.matrixWorld)
    worldPos.sub(forward.normalize().multiplyScalar(1.5));
    this.targetPos.set(worldPos.x,this.characterHeight,worldPos.z);

    this.character.position.y = 1;

    var dir = new THREE.Vector3().subVectors(this.targetPos, this.character.position);
    var dist = dir.length();
    if(dist < 1) {
      // send event and also stop moving
      this.reachedCharacter = true;
      this.el.sceneEl.emit('speech1');
      return;
    }
    dir.multiplyScalar(this.walkingSpeed/dist);
    this.character.position.add(dir)
  },

  tick: function (time, timeDelta) {

    if(!this.reachedCharacter) {
      this.updateTargetPos()
    }

    //idle

    var idx = 10*Math.sin(time/3000);
    this.character.position.y = this.characterHeight + 1 + 0.2*Math.sin(idx)/idx;

  }
});
