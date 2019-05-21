import AFRAME from 'aframe';

AFRAME.registerComponent('web-ui-controller', {
  init: function () {
    const startBtnEl = document.getElementById('buttonsContainer');
    const loseScreen = document.getElementById('loseScreenContainer');
    document.getElementById('scene2').setAttribute('visible', 'false');

    startBtnEl.addEventListener('click', event => {
      document.getElementById('scene2').setAttribute('visible', 'true');
      startBtnEl.style.display = 'none';
      // const sceneEl = document.querySelector('a-scene');
      // sceneEl.enterVR();
      this.el.emit('begin-game');
    })

    this.el.sceneEl.addEventListener('lose', event => {
      document.getElementById('scene2').setAttribute('visible', 'false');
      loseScreen.style.display = 'flex';
    })
  }
});
