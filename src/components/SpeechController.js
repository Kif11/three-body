AFRAME.registerComponent('speech-controller', {
  init:function() {
     this.el.sceneEl.addEventListener('speech1', (event) => {
       this.el.components.sound__1.playSound();
     });

     this.el.sceneEl.addEventListener('speech2', (event) => {
       this.el.components.sound__2.playSound();
     });

     this.el.addEventListener('sound-ended', (event) =>   {
       if(event.detail.id == 1){
         this.el.sceneEl.emit('speech1-ended');
       } else if(event.detail.id == 2){
        this.el.sceneEl.emit('speech2-ended');
      }
    });

   }
})
