import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('fire-manager', {
  init: function () {
    this.el.addEventListener('vertex-cache-loaded', (evt) => {
      this.model = this.el.object3D.children[0];
      this.model.visible = false;
    });

    this.el.sceneEl.addEventListener('start-char-fire', (evt) => {
      this.el.emit('start-vertex-animation'); // vertex cache texture waits for this event to start the animation
      this.animateScale = true;
      this.model.visible = true;
    });

    this.el.sceneEl.addEventListener('stop-char-fire', (evt) => {
      this.el.emit('stop-vertex-animation');
      this.animateScale = true;
      this.model.visible = false;
    });

    this.animateScale = false;
    this.scaleIncrement = new THREE.Vector3(0.00002, 0.00002, 0.00002); //per second
    this.scaleMax = 0.02;
  },

  tick: function (time, timeDelta) {
    if (this.animateScale) {
      let scale = this.el.getAttribute('scale');
      
      scale.add(this.scaleIncrement.clone().multiplyScalar(time / 10000));
      if (scale.x > this.scaleMax){
        this.animateScale = false;
      }
      this.el.setAttribute('scale', scale);
    }
  }
});
