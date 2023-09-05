import * as utils from '../utils'

function handleGetActiveWindows() {
	utils.showWindow('企业微信')
}

const exports = [
	{
		name: 'getActiveWindows',
		method: 'handle',
		handler: handleGetActiveWindows,
	},
]

export default exports
