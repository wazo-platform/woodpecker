import React from 'react';

const isMobile = typeof navigator != 'undefined' && navigator.product === 'ReactNative';
let audio = null;

// Electron
if (!isMobile && window.require) {
  // Trick to avoid requiring electron in mobile
  System.import('electron').then(electron => {
    electron.ipcRenderer.on('electron-keyup', (event, message) => {
      console.log('electron-keyup', message);
    });
    electron.ipcRenderer.on('electron-keydown', (event, message) => {
      console.log('electron-keydown', message);
    });
  });
}

// Browser not focused
if (typeof document !== 'undefined' && navigator.mediaSession) {
  audio = document.createElement('audio');
  audio.src = require('../../assets/silence.mp3');
  audio.loop = true;

  navigator.mediaSession.setActionHandler('play', async function() {
    console.log('> User clicked "Play" icon.');
    await audio.play();
  });

  navigator.mediaSession.setActionHandler('pause', function() {
    console.log('> User clicked "Pause" icon.');
    audio.pause();
  });

  audio.addEventListener('play', function() {
    navigator.mediaSession.playbackState = 'playing';
  });

  audio.addEventListener('pause', function() {
    navigator.mediaSession.playbackState = 'paused';
  });
}

const useShortcut = () => {
  if (audio) {
    audio.play().catch(error => console.log(error));
  }
}

export default useShortcut;
