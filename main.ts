import { app, BrowserWindow, ipcMain } from 'electron';
import { exec } from 'child_process';

let serverProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL('http://localhost:3000/auth');
}

ipcMain.on('open-sign-in', () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  mainWindow.loadURL('http://localhost:3000/auth/login');
});

ipcMain.on('open-main-page', () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  mainWindow.loadURL('http://localhost:3000/auth');
});

ipcMain.on('open-sign-up', () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  mainWindow.loadURL('http://localhost:3000/auth/signup');
});

app.whenReady().then(async () => {
  serverProcess = exec('npm run start', (err) => {
    if (err) {
      console.error('Failed to start NestJS server:', err);
      app.quit();
      return;
    }
  });

  setTimeout(() => {
    createWindow();
  }, 3000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    serverProcess.kill();
    app.quit();
  }
});
