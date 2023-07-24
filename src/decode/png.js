function imageData2ObjectURL(imageData, options) {
	return new Promise((resolve, reject) => {
		// Generate ImageBitmap from ImageData
		createImageBitmap(imageData, options)
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
	})
}
export {imageData2ObjectURL}