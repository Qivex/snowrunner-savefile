import {inflateBlob} from "./inflate.js"
import {imageData2ObjectURL} from "./png.js"
import {assert} from "@vue/compiler-core"

function fogBlob2ImageData(blob) {
	return new Promise((resolve, reject) => {
		blob.arrayBuffer()
			.then(buffer => {
				// Split buffer
				const sizeBuffer = buffer.slice(0, 8)
				const dataBuffer = buffer.slice(8, -16)
				// 2x UInt32 for width and height of bitmap
				const size = new Uint32Array(sizeBuffer)
				const [width, height] = size
				// Array of (width * height) bytes: 00 = Unexplored, 80 = Visible, FF = Explored
				const data = new Uint8ClampedArray(dataBuffer)
				// Test if data has correct length
				const area = width * height
				assert(data.length === area, "Fog bitmap has wrong size")
				// Map data to new RGBA buffer
				let rgba = new Uint8ClampedArray(area * 4)
				for (let pixel = 0; pixel < area; pixel++) {
					let fog = data[pixel]
					// Equivalent to: rgba.set([fog, fog, fog, 255], 4 * pixel) but twice as fast
					rgba[4*pixel  ] = fog
					rgba[4*pixel+1] = fog
					rgba[4*pixel+2] = fog
					rgba[4*pixel+3] = 255
				}
				// Resolve as ImageData
				resolve(new ImageData(rgba, width))
			})
			.catch(e => reject(e))
	})
}

function decodeFogFile(file) {
	return new Promise((resolve, reject) => {
		inflateBlob(file)
			.then(fogBlob => fogBlob2ImageData(fogBlob))
			// ImageData is mirrored vertically: Using {imageOrientation: "flipY"}
			// here is simpler & faster than manual row-swapping in previous step
			.then(imageData => imageData2ObjectURL(imageData, {imageOrientation: "flipY"}))
			.then(url => resolve(url))
			.catch(e => reject(e))
	})
}

export {decodeFogFile}