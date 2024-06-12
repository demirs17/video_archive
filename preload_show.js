const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	path: (callback) => ipcRenderer.on("path", (event, value) => callback(value)),
	db: (callback) => ipcRenderer.on("db", (event, value) => callback(value)),
	addTag: (obj) => ipcRenderer.invoke("addTag", obj),
	deleteTag: (tag, video) => ipcRenderer.invoke("deleteTag", {tag: tag, video: video}),
	/** openınfolder ındex.html den invokelanan handle fonksiyonu na gidiyor */
	openInFolder: (video) => {ipcRenderer.invoke("openInFolder", video)}
})