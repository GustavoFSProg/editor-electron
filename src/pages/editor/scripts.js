const {ipcRenderer} = require("electron")

const textarea = document.getElementById('text')
const title = document.getElementById('title')

ipcRenderer.on('set-file', function(event, data){
    textarea.value = data.content,
     title.innerHTML = data.name+'  | EDITOR'
    console.log(textarea)
})

function handleChangeText(){
    ipcRenderer.send('update-content', textarea.value)
}