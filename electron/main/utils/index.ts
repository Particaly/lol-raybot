import winTool from 'hmc-win32'
import cv from '@techstark/opencv-js'
import Jimp from 'jimp'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = resolve(fileURLToPath(import.meta.url), '../')

export function showWindow(win) {
	if (getType(win) === 'string') {
		win = findWindowByTitle(win)
	}

	if (!win) return;
	winTool.setWindowFocus(win)
	winTool.setWindowMode(win, "0", "0", null, null)
}

export function findWindowByTitle(title: string) {
	const wins = winTool.getAllWindowsHandle(true)

	return wins
		.filter(win => win.exists)
		.find((win) => win.title.includes(title))
}

export function getType(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

async function findImage(source, target) {
	const sourceFile = await Jimp.read(source)
	const targetFile = await Jimp.read(target)

	const src = cv.matFromImageData(sourceFile.bitmap)
	const temp = cv.matFromImageData(targetFile.bitmap)

	let dst = new cv.Mat();
	let mask = new cv.Mat();
	cv.matchTemplate(src, temp, dst, cv.TM_CCOEFF, mask);
	let result = cv.minMaxLoc(dst, mask);
	let maxPoint = result.maxLoc;

	return {
		position: maxPoint,
		drawRectInSrc: (outputFilepath) => {
			let color = new cv.Scalar(255, 0, 0, 255);
			let point = new cv.Point(maxPoint.x + temp.cols, maxPoint.y + temp.rows);
			cv.rectangle(src, maxPoint, point, color, 2, cv.LINE_8, 0);

			return new Jimp({
				width: src.cols,
				height: src.rows,
				data: Buffer.from(src.data)
			})
				.write(outputFilepath);
		}
	}
}

// const s = resolve(__dirname, '../../assets/im1.png');
// const t = resolve(__dirname, '../../assets/logo.png');
// const res = findImage(s, t)
// console.log(res);
