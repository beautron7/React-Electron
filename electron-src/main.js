const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const windows = new Set();

function OpenNewWindow() {
  var win = new electron.BrowserWindow({ width: 800, height: 600 })
  
  //while our window is open, it's important to maintain a global reference to it
  windows.add(win)
  win.on('closed', function () {
    windows.delete(win);
  })

  //choose between the live-reload development server and a packaged webpage to load.
  if(isInDevelopmentMode()){
    win.loadURL("http://localhost:3000")
  } else {
    win.loadURL(`file://${__dirname}/../react-build/index.html`)
  }
}

electron.app.on('ready', OpenNewWindow)


//when all windows are closed, this function will quit the app.
electron.app.on('window-all-closed', function () {
  if (process.platform !== 'darwin')//On macOS, we shouldn't quit the app when all windows close. 
    electron.app.quit();
})

electron.app.on('activate', function () {
  //this only comes up in macOs; 
  //if no windows are open when we activate the app 
  //(eg: we click on it in the dock), then we open a window.
  if (windows.size() === 0)
    OpenNewWindow();
})

function isInDevelopmentMode(){
  for (var i = 0; i < process.argv.length; i++) {
    if (process.argv[i] == "--dev") {
      return true;
    }
  }
  return false
}