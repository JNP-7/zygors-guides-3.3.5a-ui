import { app, BrowserWindow, BrowserWindowConstructorOptions, dialog, FileFilter, ipcMain } from 'electron'
import {download, Options} from 'electron-dl';
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

const DEFAULT_WINDOW_PROPS:BrowserWindowConstructorOptions = {
  icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
  },
  minWidth: 810,
  width: 1220
}

function createWindow() {
  win = new BrowserWindow(DEFAULT_WINDOW_PROPS)

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

const DOWNLOAD_FILE_MSG_NAME = "download-file";

ipcMain.on(DOWNLOAD_FILE_MSG_NAME, async(_, downloadProps:any) => {

  let fileFilter: FileFilter[] = [
    {
      name: downloadProps.properties.mimeType, 
      extensions: [downloadProps.properties.fileExtension]
    }
  ];

  let customURL = dialog.showSaveDialogSync(
    {
      defaultPath: downloadProps.properties.fileName, 
      filters: fileFilter,
    }
  );

  if(customURL) {

    let urlParts = customURL.split("\\");
    let newFileName = urlParts[urlParts.length - 1];

    let downloadOptions: Options = {
      filename: newFileName !== undefined ? newFileName : `${downloadProps.properties.fileName}.${downloadProps.properties.fileExtension}`,
      onCancel: (downloadItem:any) => {
        win?.webContents.send(downloadProps.cancelledMsgName, downloadItem);
      },
      onCompleted: (downloadItem:any) => {
        win?.webContents.send(downloadProps.completedMsgName, downloadItem);
      }
    };

    let focusedWindow = BrowserWindow.getFocusedWindow();

    await download(
      focusedWindow ? focusedWindow : new BrowserWindow(DEFAULT_WINDOW_PROPS), 
      downloadProps.downloadUrl,
      downloadOptions
    );

  }else {
    //save was cancelled, notify the frontend
    win?.webContents.send(downloadProps.cancelledMsgName);
  }

})
