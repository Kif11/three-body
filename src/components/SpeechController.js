AFRAME.registerComponent('speech-controller', {
  init:function() {
    this.el.sceneEl.addEventListener('speech1', (event) => {
     this.el.components.sound__1.playSound();
    });

    this.el.sceneEl.addEventListener('speech2', (event) => {
     this.el.components.sound__2.playSound();
    });

    this.el.sceneEl.addEventListener('speech3', (event) => {
     this.el.components.sound__3.playSound();
    });

    this.el.sceneEl.addEventListener('speech4', (event) => {
     this.el.components.sound__4.playSound();
    });
    this.el.sceneEl.addEventListener('speech5', (event) => {
     this.el.components.sound__5.playSound();
    });
    this.el.sceneEl.addEventListener('speech6', (event) => {
     this.el.components.sound__6.playSound();
    });
    this.el.sceneEl.addEventListener('speech7', (event) => {
     this.el.components.sound__7.playSound();
    });
    this.el.sceneEl.addEventListener('speechWin', (event) => {
     this.el.components.sound__8.playSound();
    });

    this.el.sceneEl.addEventListener('comment1', (event) => {
     this.el.components.sound__9.playSound();
    });

    this.el.sceneEl.addEventListener('comment2', (event) => {
     this.el.components.sound__10.playSound();
    });

    this.el.addEventListener('sound-ended', (event) =>   {
      if(event.detail.id == 1){
        this.el.sceneEl.emit('speech1-ended');
      } else if(event.detail.id == 2){
        this.el.sceneEl.emit('speech2-ended');
      } else if(event.detail.id == 3){
        this.el.sceneEl.emit('speech3-ended');
      } else if(event.detail.id == 4){
        this.el.sceneEl.emit('speech4-ended');
      } else if(event.detail.id == 5){
        this.el.sceneEl.emit('speech5-ended');
      } else if(event.detail.id == 6){
        this.el.sceneEl.emit('speech6-ended');
      } else if(event.detail.id == 7){
        this.el.sceneEl.emit('speech7-ended');
      } else if(event.detail.id == 8){
        this.el.sceneEl.emit('speechWin-ended');
      }else if(event.detail.id == 9){
        this.el.sceneEl.emit('comment1-ended');
      }else if(event.detail.id == 10){
        this.el.sceneEl.emit('comment2-ended');
      }
    });

   }
})
