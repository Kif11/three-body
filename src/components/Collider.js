import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('collider', {
  schema: {
    camera: {
      type: 'boolean',
      default: 'false'
    }
  },

  init: function () {
    this.raycaster = new THREE.Raycaster();
    if(this.data.camera){
      this.raycastingEl = document.querySelector('#camera');
    } else {
      this.raycastingEl = this.el;
    }

  },

  collide: function(collider) {
    //global collider entities ............
    this.colliders = this.el.sceneEl.object3D.colliders;
    var worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(this.raycastingEl.object3D.matrixWorld);
    var forward = new THREE.Vector3(0,0,-1).transformDirection(this.raycastingEl.object3D.matrixWorld);

    this.raycaster.set(worldPos, forward.normalize());
    var closestPoint = this.raycaster.intersectObjects( this.colliders, true )[0];
    if(closestPoint){
      //do not move camera!
      if(closestPoint.distance < 1){
        return true;
      }
    }
    return false;
  },
});
