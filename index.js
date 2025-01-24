const {app, BrowserWindow, dialog, Menu} = require('electron')
const fs = require('fs')
const path = require('path')

var mainWindow = null

async function CreateWindow(){
    mainWindow = new BrowserWindow({
        width: '300',
        height: '300',
        webPreferences: {
            nodeIntegration: true
        }
    })

    console.log("create window")

  await  mainWindow.loadFile('src/pages/editor/index.html')

//   mainWindow.webContents.openDevTools();

createNewFile()
}

var file = {}
function  createNewFile(){
  file = {
    name: "novo-arquivo.txt",
    content: '',
    saved: false,
    path: app.getPath('documents')+'/novo-arquivo.txt'
  }

  console.log(file)

  mainWindow.webContents.send('set-file', file)
}

 function writeFile(filePath){
    try {

        fs.writeFile(filePath, file.content, function(error){
            if(error) { throw error}

            file.path  = filePath
            file.saved= true
            file.name = path.basename(filePath)
        })
        



    } catch (error) {
        console.log(error)
    }
 }


async function saveFileAs(){

    let dialogFile = await dialog.showSaveDialog({
        defaultPath: file.path
    })

    writeFile(dialogFile .filePath)
}

const templateMenu =  [ 
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Novo',
                click(){
                    createNewFile();
                }
            },
            {
                label: 'Abrir'
            },

            {
                label: 'Salvar'
            },
            {
                label: 'Salvar Como',
                click(){
                    saveFileAs();
                }
            },
            {
                label: 'Fechar',
                role: process.platform === 'darwin' ? 'close' : 'quit'
            }


        ]
    }

]

const menu = Menu.buildFromTemplate(templateMenu)

Menu.setApplicationMenu(menu)

app.whenReady().then(CreateWindow)

app.on("activate", () => {
if(BrowserWindow.getAllWindows().lenght === 0){
    CreateWindow()
}
})

