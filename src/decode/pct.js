import {imageData2ObjectURL} from "./png.js"

/* Mutliple blocks of format:
- 16bit opcode
- 32bit end of block (absolute offset from file start)
- respective content

0x00F0 {
	int32	blockEnd = 10
	char[4]	magicNumber = "TCIP"	// PICT reversed
}

0x0102 {
	int32 blockEnd = 32
	int32 width
	int32 height
	int32 unknown = 1
	int32 unknown = 1
}

0x00F2 {
	int32 blockEnd = 42
	int32 unknown
}

0x00F9 {
	int32 blockEnd = 52
	int32 unknown = 1
}

0x0107 {
	int32 blockEnd = 66
	int32 unknown = 0
	int32 dataLength
}

0x00FF {
	int32 blockEnd = 72 + dataLength
	char[dataLength] imagedata
}

0x0001 {
	int32 blockEnd = 78 + dataLength
}
*/

function pctBlob2ImageData(blob) {
	return new Promise((resolve, reject) => {
		blob.arrayBuffer()
			.then(buffer => {
				// New buffers: Image dimensions and data
				const sizeBuffer = buffer.slice(16, 24)
				const dataBuffer = buffer.slice(72, -6)
				// Extract size: 2x UInt32 for width and height
				const size = new Uint32Array(sizeBuffer)
				const [width, height] = size
				// Find bits per pixel
				const bpp = dataBuffer.byteLength / (width * height)
				console.log(bpp)
				let arrayType
				switch (bpp) {
					case 4:
						arrayType = Uint32Array
						break
					case 2:
						arrayType = Uint16Array
						break
					default:
						arrayType = Uint8Array
				}
				const data = new arrayType(dataBuffer)
				// Map data to new RGBA buffer
				const area = width * height
				let rgba = new Uint8ClampedArray(area * 4)
				for (let pixel = 0; pixel < area; pixel++) {
					let brightness = data[pixel] / 256 ** (bpp-1)	// Map larger types to Uint8
					rgba[4*pixel  ] = 255
					rgba[4*pixel+1] = 0
					rgba[4*pixel+2] = 0
					rgba[4*pixel+3] = brightness
				}
				// Resolve as ImageData
				resolve(new ImageData(rgba, width))
			})
	})
}

function decodePCTFile(file) {
	return new Promise((resolve, reject) => {
		pctBlob2ImageData(file)
			.then(imageData => imageData2ObjectURL(imageData, {imageOrientation: "flipY"}))
			.then(url => resolve(url))
			.catch(e => reject(e))
	})
}

export {decodePCTFile}