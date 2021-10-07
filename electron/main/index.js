'use strict';
const path = require('path');
const { app, BrowserWindow } = require('electron');
const { format: formatUrl } = require('url');
// const ioHook = require('iohook');

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

const createMainWindow = () => {
  const browserWindow = new BrowserWindow({ webPreferences: { nodeIntegration: true } });

  if (isDevelopment) {
    browserWindow.loadURL(`http://localhost:19006`);
  } else {
    browserWindow.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      })
    );
  }

  browserWindow.on('closed', () => {
    mainWindow = null;
  });

  // ioHook.on('keyup', event => browserWindow.webContents.send('electron-keyup', event));
  // ioHook.on('keydown', event => browserWindow.webContents.send('electron-keydown', event));
  //
  // ioHook.start();

  return browserWindow;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // ioHook.stop();
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});
