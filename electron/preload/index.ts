import { contextBridge, ipcRenderer } from 'electron'

const api = {
	getActiveWindows: () => {
		ipcRenderer.invoke('getActiveWindows').then((data) => {
			console.log(data)
		})
	},
}

contextBridge.exposeInMainWorld('api', api)
