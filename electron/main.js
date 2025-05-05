const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1250,
    height: 725,
    icon: "../assets/favicon.ico"
  })

  win.setMenuBarVisibility(false)
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})