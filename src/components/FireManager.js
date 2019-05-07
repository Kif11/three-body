import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('fire-manager', {
  init: function () {
    this.el.sceneEl.addEventListener('vertex-cache-loaded', (evt) => {
      //remove from scene once loaded, the scale starts at 0 anyways but this is just for performance
      this.model = this.el.getObject3D('mesh');
      this.model.visible = false;
    });
    //start the animation on our specific event ( the first speech )
    this.el.sceneEl.addEventListener('speech1', (evt) => {
      this.el.emit('start-vertex-animation'); // vertex cache texture waits for this event to start the animation
      this.animateScale = true;
      this.model.visible = true;
    });

    this.animateScale = false;
    this.scaleIncrement = new THREE.Vector3(0.00002, 0.00002, 0.00002); //per second
    this.scaleMax = 0.02;
  },
  tick: function (time, timeDelta) {
    if(this.animateScale){
      let scale = this.el.getAttribute('scale');
      scale.add(this.scaleIncrement.clone().multiplyScalar(time/1000));
      if(scale.x > this.scaleMax){
        this.animateScale = false;
      }
      this.el.setAttribute('scale', scale);
    }
  }
});
