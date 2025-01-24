const {app, BrowserWindow, dialog, ipcMain, shell, Menu, Accelerator} = require('electron')
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


ipcMain.on('update-content', function(event,data){
    file.content = data
})
}

var file = {}
function  createNewFile(){
  file = {
    name: "novo-arquivo.txt",
    content: '',
    saved: false,
    path: app.getPath('documents')+'/novo-arquivo.txt'
  }

//   console.log(file)

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
        

        mainWindow.webContents.send('set-file', file)

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

 function saveFile(){
    if(file.saved){
        return  writeFile(file.path)
    }

    return saveFileAs()
}

function readFile(filePath){
try {

    return fs.readFileSync(filePath, 'utf8')
    
} catch (error) {
    console.log(error)
    
}
}

async function openFile(){
   let dialogFile = await dialog.showOpenDialog({
    defaultPath: file.path
   })

   if (dialogFile.canceled) return false;

   file = {
    name: path.basename(dialogFile.filePaths[0]),
    content: readFile(dialogFile.filePaths[0]),
    saved: true,
    path: dialogFile.filePaths[0]
   }

   console.log(file)
   mainWindow.webContents.send('set-file', file)
}

const templateMenu =  [ 
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Novo',
                accelerator: 'cmdorCtrl+n',
                click(){
                    createNewFile();
                }
            },
            {
                label: 'Abrir',
                accelerator: 'cmdorCtrl+o',
                click(){
                    openFile()
                }
            },

            {
                label: 'Salvar',
                accelerator: 'cmdorCtrl+s',
                click(){
                    saveFile()
                }
            },
            {
                label: 'Salvar Como',
                accelerator: 'cmdorCtrl+shift+s',
                click(){
                    saveFileAs();
                }
            },
            {
                label: 'Fechar',
                role: process.platform === 'darwin' ? 'close' : 'quit'
            }


        ]
    },
    {
        label:'Editar',
         
         submenu:[
            {
                label: 'Desfazer',
                role:"undo"
            },
            {
                label: 'Refazer',
                role:"redo"
            },
            {
                type: "separator"
            },
            {
                label: 'Copiar',
                role:"copy"
            },
            {
                label: 'Cortar',
                role:"cut"
            },
            {
                label: 'Colar',
                role:"paste"
            }
         ]
    },
    {
         label: "Ajuda",
           submenu: [
            {
                label: "Canal Dev",
                 click(){
                    shell.openExternal('https://youtube.com')
                 }

                 

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

