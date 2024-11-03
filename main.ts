import { app, BrowserWindow, ipcMain } from 'electron';
import { exec, spawn } from 'child_process';
import axios from 'axios';

let serverProcess: any;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  setTimeout(() => {
    win.loadURL('http://localhost:3000/auth');
  }, 1000);

  win.on('closed', () => {
    console.log('Window closed. Closing the server.');
    closeServer();
  });
}

function closeServer() {
  if (global.nestServerInstance) {
    global.nestServerInstance.close(() => {
      console.log('NestJS сервер закрыт.');
    });
  }

  exec('npx kill-port 3000', (error, stdout, stderr) => {
    if (error) {
      console.error(`Ошибка при освобождении порта 3000: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Сообщение об ошибке: ${stderr}`);
      return;
    }
    console.log(`Порт 3000 освобожден: ${stdout}`);
  });
}

ipcMain.on('open-main-auth', () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  mainWindow.loadURL('http://localhost:3000/auth');
});
ipcMain.on('open-main-page', async () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  try {
    mainWindow.loadURL('http://localhost:3000');
  } catch (error) {
    console.error('Ошибка при загрузке главной страницы:', error);
  }
});

ipcMain.on('open-sign-in', () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  mainWindow.loadURL('http://localhost:3000/auth/login');
});

ipcMain.on('open-sign-up', () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  mainWindow.loadURL('http://localhost:3000/auth/signup');
});

ipcMain.on('sign-up', async (event, userData) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/auth/signup',
      userData,
    );
    event.reply('sign-up-response', response.data);
  } catch (error) {
    if (typeof error.response.data.message === 'string') {
      error.response.data.message = [error.response.data.message];
    }
    console.error(error.response);
    event.reply('sign-up-response', { error: error.response.data });
  }
});

ipcMain.on('login', async (event, userData) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/auth/login',
      userData,
    );
    event.reply('login-response', response.data);
  } catch (error) {
    if (typeof error.response.data.message === 'string') {
      error.response.data.message = [error.response.data.message];
    }
    console.error(error.response);
    event.reply('login-response', { error: error.response.data });
  }
});

app.whenReady().then(() => {
  serverProcess = spawn('npm', ['run', 'start'], { shell: true });

  serverProcess.stdout.on('data', (data) => {
    console.log(`NestJS: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`NestJS error: ${data}`);
  });

  serverProcess.on('exit', (code) => {
    console.log(`NestJS server exited with code ${code}`);
    app.quit();
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
  closeServer();
});
