import { ipcMain } from 'electron'

const modules = (import.meta as any).glob('./*.ts')

for (let path in modules) {
	const module = modules[path]
	module().then((mod) => {
		if (!mod.default) return
		const ipcExportObject = mod.default
		if (Array.isArray(ipcExportObject)) {
			ipcExportObject.forEach((ipcExport) => {
				try {
					ipcMain[ipcExport.method](ipcExport.name, ipcExport.handler)
					console.log('ipc-main:', ipcExport.name, 'registered')
				} catch (e) {
					console.log(`ipc-main register error: file which in '${path}' caught error with handler '${ipcExport.name}' error.`)
				}
			})
		} else {
			try {
				ipcMain[ipcExportObject.method](ipcExportObject.name, ipcExportObject.handler)
				console.log('ipc-main:', ipcExportObject.name, 'registered')
			} catch (e) {
				console.log(`ipc-main register error: file which in '${path}' caught error with handler '${ipcExportObject.name}' error.`)
			}
		}
	})
}
