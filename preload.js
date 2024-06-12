const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	getFiles: () => ipcRenderer.invoke("getFiles"),
	openInFolder: (path) => ipcRenderer.invoke("openInFolder", path),
	goToShowPage: (name) => ipcRenderer.invoke("goToShowPage", name),
	getAllVideos: () => ipcRenderer.invoke("getAllVideos"),
	isVideoExists: (video) => ipcRenderer.invoke("isVideoExists", video),
	deleteRecord: (video) => ipcRenderer.invoke("deleteRecord", video)
})