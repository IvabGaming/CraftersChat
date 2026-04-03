const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('index.html');
}

ipcMain.on('load-history', (event) => {
    const filePath = path.join(__dirname, 'messages.txt');

    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) throw err;
            event.replay('history-data', data);

ipcMain.on('save-message', (event, message) => {
    const filePath = path.join(__dirname, 'messages.txt');
    fs.appendFile(filePath, message + '\n', (err) => {
        if (err) throw err;
        console.log('Saved to file!');
    });
});

app.whenReady().then(createWindow);