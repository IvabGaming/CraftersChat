const { app, BrowserWindow, ipcMain } = require('electron');
const Redis = require('ioredis');

const redis = new Redis({
  host: 'redis-18531.c262.us-east-1-3.ec2.cloud.redislabs.com',
  port: 18531,
  password: 'JqSKZX2mtm68KsfU62QHEc5IY1IZiDrC'
});

const sub = new Redis({
  host: 'redis-18531.c262.us-east-1-3.ec2.cloud.redislabs.com',
  port: 18531,
  password: 'JqSKZX2mtm68KsfU62QHEc5IY1IZiDrC'
});

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWindow.loadFile('index.html');

  sub.subscribe('chat');
  sub.on('message', (channel, msg) => {
    mainWindow.webContents.send('message', msg);
  });
});

ipcMain.on('send-message', (event, msg) => {
  redis.publish('chat', msg);
  redis.lpush('history', msg);
  redis.ltrim('history', 0, 99); // Keep only the latest 100 messages
});

ipcMain.on('get-history', (event) => {
	  redis.lrange('history', 0, -1, (err, messages) => {
		messages.reverse(); // Reverse to show oldest first
		event.reply('history', messages);
	  });
})
