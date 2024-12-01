import { app, BrowserWindow, ipcMain } from 'electron';
import { exec, spawn } from 'child_process';
import axios from 'axios';
import { promises as fs } from 'fs';

let serverProcess: any;

let currentUser: any;

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
  }, 5000);

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

ipcMain.handle('open-main-auth', async () => {
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

ipcMain.on('open-captcha-verification-page', () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  mainWindow.loadURL('http://localhost:3000/captcha/page');
});

ipcMain.on('open-editor-window', async () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  mainWindow.loadURL('http://localhost:3000/editor/page');
});

ipcMain.handle('get-user-rights-on-file', async (_event, fileName) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/editor/user-rights',
      {
        username: currentUser.username,
        filename: fileName,
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении прав', error);
    return 'NONE';
  }
});

ipcMain.on('generate-captcha', async (event) => {
  try {
    const response = await axios.get('http://localhost:3000/captcha');
    event.reply('captcha-generated', { image: response.data.image });
  } catch (error) {
    console.error('Ошибка при генерации CAPTCHA:', error);
  }
});

ipcMain.handle('get-file-with-rights', async (_event, fileName) => {
  try {
    console.log('in get file get-file-with-rights');
    console.log('filePath: ' + fileName);

    // Отправляем единый запрос на сервер
    const response = await axios.post('http://localhost:3000/editor/file', {
      username: currentUser.username,
      filename: fileName,
    });

    const { decryptedContent, rights, hashMismatch, error } = response.data;

    console.log('Decrypted File:', decryptedContent);
    console.log('Rights:', rights);

    return {
      content: decryptedContent,
      rights: rights,
      hashMismatch,
      error,
    };
  } catch (error) {
    console.error('Error retrieving file and rights:', error.message);
    throw new Error('Failed to load file and rights');
  }
});

ipcMain.handle('decrypt-file', async (_event, filePath) => {
  try {
    const response = await axios.post('http://localhost:3000/files/decrypt', {
      filePath,
    });
    return response.data.decryptedContent;
  } catch (error) {
    console.error('Error during decryption:', error);
    throw new Error('Decryption failed');
  }
});

ipcMain.on('verify-captcha', async (event, { text }) => {
  try {
    const response = await axios.post('http://localhost:3000/captcha/verify', {
      userInput: text,
    });
    event.reply('captcha-verification', { isValid: response.data.isValid });
  } catch (error) {
    console.error('Ошибка при проверке CAPTCHA:', error);
    event.reply('captcha-verification', { error: error.response.data });
  }
});

ipcMain.on('sign-up', async (event, userData) => {
  try {
    currentUser = { username: userData.login };

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

ipcMain.handle('encrypt-file', async (_event, content, fileName) => {
  try {
    const response = await axios.post('http://localhost:3000/editor/encrypt', {
      content,
      fileName,
      username: currentUser.username,
    });
    return response.data.encryptedContent;
  } catch (error) {
    console.error('Error during encryption:', error);
    throw new Error('Encryption failed');
  }
});

ipcMain.on('login', async (event, userData) => {
  try {
    currentUser = { username: userData.username };

    const response = await axios.post(
      'http://localhost:3000/auth/login',
      userData,
    );
    event.reply('login-response', response.data);
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        const failedAttempts = data.failedAttempts || 0;
        const message =
          data.message + `. There are ${3 - failedAttempts} attempts left`;
        event.reply('login-response', {
          error: {
            message: [message],
          },
        });
      } else if (status === 429) {
        event.reply('load-captcha');
      } else {
        console.error(error.response);
        event.reply('login-response', { error: data });
      }
    } else {
      console.error('Ошибка при выполнении запроса:', error.message);
      event.reply('login-response', {
        error: { message: 'Неизвестная ошибка' },
      });
    }
  }
});

ipcMain.handle('save-file', async (_event, filePath, content) => {
  try {
    await fs.writeFile(filePath, content, 'utf8');
  } catch (error) {
    console.error('Error saving the file:', error);
    throw new Error('File save failed');
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
