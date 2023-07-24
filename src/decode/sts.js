import {decodeDDSFile} from "./dds.js"
import {inflateBlob} from "./inflate.js"
import {imageData2ObjectURL} from "./png.js"

function decodeSTSFile(file) {
	return new Promise((resolve, reject) => {
		inflateBlob(file)
			.then(stsBlob => {
				stsBlob.arrayBuffer()
					.then(buffer => {
						const width = 1000
						let len = buffer.byteLength
						let rows = Math.ceil(len / (4*width))
						let data = new Uint8Array(buffer)
						let rgba = new Uint8ClampedArray(rows * 4 * width)
						for (let i=0; i<len; i++) {
							rgba[i] = data[i]
						}
						console.log(rgba.length)
						return new ImageData(rgba, width)
					})
					.then(imageData => imageData2ObjectURL(imageData, {imageOrientation: "flipY"}))
					.then(url => resolve(url))
			})
	})
}



export {decodeSTSFile}