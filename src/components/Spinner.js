import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('spinner', {
  tick: function (time, timeDelta) {
    this.el.object3D.rotation.x += 0.01;
    this.el.object3D.rotation.y += 0.01;
  }
});
