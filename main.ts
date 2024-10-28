import { app, BrowserWindow, ipcMain } from 'electron';
import { exec } from 'child_process';
import axios from 'axios';
import { getWmicUUID } from './getuuid';

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

ipcMain.on('login', async (event, data) => {
  try {
    const response = await axios.post('http://localhost:3000/auth/login', data);
    console.log(response.data);
    event.reply('login-response', response.data);
  } catch (error) {
    console.error('Login error:', error.body);
    event.reply('login-response', { error: 'Login failed' });
  }
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
