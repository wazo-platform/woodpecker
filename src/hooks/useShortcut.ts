import React, { useEffect, useState } from 'react';

const isMobile = typeof navigator != 'undefined' && navigator.product === 'ReactNative';
let audio: HTMLAudioElement | null = null;
let onPlay: Function = () => {};
let onPause: Function = () => {};

// Browser not focused
if (typeof document !== 'undefined' && navigator.mediaSession) {
  audio = document.createElement('audio');
  audio.src = require('../../assets/silence.mp3');
  audio.loop = true;

  onPlay = () => navigator.mediaSession.playbackState = 'playing';
  onPause = () => navigator.mediaSession.playbackState = 'paused';

  audio.addEventListener('play', onPlay);
  audio.addEventListener('pause', onPause);
}

const useShortcut = (shortcut: string, status: boolean) => {
  const [keyDown, setKeyDown] = useState(status);

  useEffect(() => {
    if (!audio) {
      return;
    }

    if (status) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [status]);

  useEffect(() => {
    // Browser
    if (audio) {
      const tryToPlay = setInterval(() => {
        audio.play().then(() => {
          if (!status) {
            audio.pause();
          }
          clearInterval(tryToPlay);
        }).catch(() => {});
      }, 500);

      navigator.mediaSession.setActionHandler('play', async function() {
        setKeyDown(true);
        await audio.play();
      });

      navigator.mediaSession.setActionHandler('pause', function() {
        setKeyDown(false);
        audio.pause();
      });
    }

    // Electron
    if (!isMobile && window.require) {
      // Trick to avoid requiring electron in mobile
      System.import('electron').then((electron: any) => {
        electron.ipcRenderer.on('electron-keyup', (event: Object, message: Object) => {
          console.log('electron-keyup', message);
        });
        electron.ipcRenderer.on('electron-keydown', (event: Object, message: Object) => {
          console.log('electron-keydown', message);
        });
      });
    }

    return () => {
      if (audio) {
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
      }
    }
  }, []);

  return keyDown;
}

export default useShortcut;
