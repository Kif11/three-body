AFRAME.registerComponent('ambient-controller', {
  init:function() {

    this.el.sceneEl.addEventListener('begin-game', (evt) => {
      this.el.components.sound__1.playSound();
      this.el.components.sound__2.playSound();
      this.el.components.sound__3.playSound();
      this.el.components.sound__1.pool.children[0].setVolume(0.2);
    });

    this.el.sceneEl.addEventListener('speech1', (event) => {
    });

    this.el.sceneEl.addEventListener('speech3-ended', (event) => {
      this.el.components.sound__2.pool.children[0].setVolume(0.2)
    });

    this.el.sceneEl.addEventListener('speech4-ended', (event) => {
      this.el.components.sound__3.pool.children[0].setVolume(0.2)
    });
   }
})
