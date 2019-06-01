import AFRAME from 'aframe';

AFRAME.registerComponent('web-ui-controller', {
  init: function () {
    const { sceneEl } = this.el;
    const startBtnEl = document.getElementById('startBtn');
    const winScreen = document.getElementById('winScreen');
    const loseScreen = document.getElementById('loseScreen');
    const mainScene = document.getElementById('mainScene');
    const introScreen = document.getElementById('introScreen');
    const enterVRButton = document.querySelector('.VRButton');
    const introText = document.getElementById('introText');

    sceneEl.addEventListener('loaded', (event) => {
      // all game assets loaded
      introScreen.classList.remove('hidden');
    });

    sceneEl.addEventListener('enter-vr', (event) => {      
      introText.emit('show-intro-text');
    });

    sceneEl.addEventListener('fade-in-complete', (event) => {
      introText.emit('hide-intro-text');
    });

    startBtnEl.addEventListener('click', event => {
      sceneEl.enterVR();
      mainScene.setAttribute('visible', 'true');
      introScreen.setAttribute('style', 'visibility: hidden');
      introScreen.setAttribute('visible', 'false');
      enterVRButton.classList.add('visible');
      this.el.emit('begin-game');
    })

    sceneEl.addEventListener('gameLose', event => {
      sceneEl.exitVR();
      loseScreen.setAttribute('style', 'visibility: visible');
      mainScene.setAttribute('visible', 'false');
      enterVRButton.classList.remove('visible');
    })

    sceneEl.addEventListener('gameWin', event => {
      sceneEl.exitVR();
      winScreen.setAttribute('style', 'visibility: visible');
      mainScene.setAttribute('visible', 'false');
      enterVRButton.classList.remove('visible');
    })
  }
});
