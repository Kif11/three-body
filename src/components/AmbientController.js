AFRAME.registerComponent('ambient-controller', {
  init: function() {
    this.easingIn = {};
    this.easingOut = {};
    this.targetVolume = 0.5;

    this.el.sceneEl.addEventListener('begin-game', () => {
      this.el.components.sound__1.playSound();
      this.el.components.sound__2.playSound();
      this.el.components.sound__3.playSound();
      this.el.components.sound__1.pool.children[0].setVolume(this.targetVolume);
    });

    this.el.sceneEl.addEventListener('speech4-ended', () => {
      this.easingIn['2'] = this.el.components.sound__2.pool.children[0];
    });

    this.el.sceneEl.addEventListener('speech6-ended', () => {
      window.setTimeout(() => {
        this.easingIn['3'] = this.el.components.sound__3.pool.children[0];
      }, 2000);
    });

    this.el.sceneEl.addEventListener('win', () => {
      this.easingOut['2'] = this.el.components.sound__2.pool.children[0];
      this.easingOut['3'] = this.el.components.sound__3.pool.children[0];
    });
  },

  tick: function(time, timeDelta) {
    for(var key in this.easingIn) {
      var value = this.easingIn[key];
      var curVolume = value.getVolume();
      curVolume += 0.0000625*timeDelta;
      if (curVolume > this.targetVolume){
        delete this.easingIn[key];
      } else {
        value.setVolume(curVolume);
      }
    }
    for(var key in this.easingOut) {
      var value = this.easingOut[key];
      var curVolume = value.getVolume();
      curVolume -= 0.0000625*timeDelta;
      if(curVolume <= 0){
        delete this.easingOut[key];
      } else {
        value.setVolume(curVolume);
      }
    }
  }
})
