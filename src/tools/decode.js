function inflateBlob(blob, uncompressedSize) {
	let options = undefined
	// Avoid excessive memory usage when uncompressed size is known
	if (uncompressedSize > 0) {
		options = {
			bufferType: 0,	// 0 = BLOCK, 1 = ADAPTIVE
			bufferSize: uncompressedSize
		}
	}
	// Async decompression
	return new Promise((resolve, reject) => {
		try {
			blob.arrayBuffer().then(buf => {
				const inflateTask = new Zlib.Inflate(new Uint8Array(buf), options)
				resolve(new Blob([inflateTask.decompress()]))
			})
		} catch (e) {
			reject(e)
		}
	})
}

function fogBlob2ImageData(blob) {
	return new Promise((resolve, reject) => {
		// 2x UInt32 for width and height of bitmap
		const sizeBlob = blob.slice(0,8)
		// Array of (width * height) bytes: 00 = Unexplored, 80 = Visible, FF = Explored
		const dataBlob = blob.slice(8, -16)
		// Transform blobs
		Promise.all([
			sizeBlob.arrayBuffer(),
			dataBlob.arrayBuffer()
		]).then((values) => {
			const size = new Uint32Array(values[0])
			const data = new Uint8ClampedArray(values[1])
			// TODO: These might be switched (check Island Lake/White Valley/Quarry)
			const width = size[0]
			const height = size[1]
			// Test if data has correct length
			const area = width * height
			console.assert(data.length === area, "Fog bitmap has wrong size")
			// Map data to RGBA (using .map(n=>[n,n,n,255]) with .flat() was WAY slower - 300ms vs 2ms)
			let rgba = new Uint8ClampedArray(area * 4)
			let val
			for (let i=0; i<area; i++) {
				val = data[i]
				rgba[4*i+0] = val
				rgba[4*i+1] = val
				rgba[4*i+2] = val
				rgba[4*i+3] = 255
			}
			// Resolve as ImageData
			resolve(new ImageData(rgba, width))
		})
	})
}

function decodeFogFile(file) {
	return new Promise((resolve, reject) => {
		// Find uncompressed size (Uint32)
		file.slice(0, 4)
			.arrayBuffer()
			.then(buffer => {
				const uncompressedSize = new Uint32Array(buffer)[0]
				// Decode remaining data using inflate
				const compressedData = file.slice(4)
				return inflateBlob(compressedData, uncompressedSize)
			})
			// Generate ImageData from Bitmap
			.then(uncompressedData => fogBlob2ImageData(uncompressedData))
			// Generate ImageBitmap from ImageData
			.then(imageData => createImageBitmap(imageData))
			// Render using OffscreenCanvas & convert to PNG
			.then(imageBitmap => {
				let can = new OffscreenCanvas(imageBitmap.width, imageBitmap.height)
				let ctx = can.getContext("bitmaprenderer")
				ctx.transferFromImageBitmap(imageBitmap)
				return can.convertToBlob()	// PNG by default
			})
			// Resolve with object URL
			.then(pngBlob => {
				resolve(URL.createObjectURL(pngBlob))
			})
			.catch(e => reject(e))
	})
}

export {decodeFogFile}