AFRAME.registerComponent('ambient-controller', {
  init:function() {
    this.easingIn = {};
    this.easingOut = {};

    this.el.sceneEl.addEventListener('begin-game', (evt) => {
      this.el.components.sound__1.playSound();
      this.el.components.sound__2.playSound();
      this.el.components.sound__3.playSound();
      this.el.components.sound__1.pool.children[0].setVolume(0.2);
    });

    this.el.sceneEl.addEventListener('speech1', (event) => {
    });

    this.el.sceneEl.addEventListener('speech4-ended', (event) => {
      this.easingIn['2'] = this.el.components.sound__2.pool.children[0];
    });

    this.el.sceneEl.addEventListener('speech6-ended', (event) => {
      window.setTimeout(() => {
        this.easingIn['3'] = this.el.components.sound__3.pool.children[0];
      }, 2000);
    });

    this.el.sceneEl.addEventListener('win', (event) => {
      this.easingOut['2'] = this.el.components.sound__2.pool.children[0];
      this.easingOut['3'] = this.el.components.sound__3.pool.children[0];
    });
  },
  tick: function(time, timeDelta) {
    for(var key in this.easingIn) {
      var value = this.easingIn[key];
      var curVolume = value.getVolume();
      curVolume += 0.001;
      if(curVolume > 0.2){
        delete this.easingIn[key];
      } else {
        value.setVolume(curVolume);
      }
    }
    for(var key in this.easingOut) {
      var value = this.easingOut[key];
      var curVolume = value.getVolume();
      curVolume -= 0.001;
      if(curVolume <= 0){
        delete this.easingOut[key];
      } else {
        value.setVolume(curVolume);
      }
    }
  }
})
