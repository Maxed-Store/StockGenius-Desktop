const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const isDev = require('electron-is-dev'); 

function createWindow() {
const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  icon: path.join(__dirname, './src/assets/icon'),
  backgroundColor: '#2e2c29',
  webPreferences: {
     // preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: true,
    contextIsolation: false,
    webSecurity: false,
    enableRemoteModule: true,
  },
});
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}


app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  console.log('App is about to quit');
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('print-bill', (event, billHTML) => {
  const printWindow = new BrowserWindow({ show: false });
  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(billHTML)}`);
  printWindow.webContents.on('did-finish-load', () => {
    printWindow.webContents.print({}, (success, errorType) => {
      if (!success) console.log(errorType);
      printWindow.close();
    });
  });
});