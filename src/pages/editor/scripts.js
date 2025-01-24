const {ipcRenderer} = require("electron")

const text = document.getElementById('text')
const title = document.getElementById('title')

ipcRenderer.on('set-file', function(event, data){
    text.value = data.content,
     title.innerHTML = data.name+'  | EDITOR'
    console.log(data)
})