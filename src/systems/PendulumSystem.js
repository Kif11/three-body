import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

//keeps track of all pendulums, and colors them all when in sync
AFRAME.registerSystem('pendulum', {
  schema: {
  },
  init: function () {
    this.pendulums = [];
    this.totalDist = 10;
  },
  registerPendulum: function(pendulum) {
    this.pendulums.push(pendulum);
  },
  getSynchStatus: function(pendulum) {
    return (this.totalDist < 1)? true : false;
  },
  tick: function (time, timeDelta) {
    if( Math.abs(this.pendulums[0].dampeningFactor) < 0.1 || Math.abs(this.pendulums[1].dampeningFactor) < 0.1 || Math.abs(this.pendulums[2].dampeningFactor) < 0.1 ){
      this.totalDist = 10;
      return;
    }
    //assume we have 3 pendulums .
    var dist1 = Math.abs(this.pendulums[0].curAngle-this.pendulums[1].curAngle);
    var dist2 = Math.abs(this.pendulums[0].curAngle-this.pendulums[2].curAngle);
    var dist3 = Math.abs(this.pendulums[1].curAngle-this.pendulums[2].curAngle);

    this.totalDist = (dist1 + dist2 + dist3)/3;
    this.pendulums.forEach((p) => {
      p.brighten(1/this.totalDist/25);
    })
  }
});
