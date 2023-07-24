function inflateBuffer(buffer, uncompressedSize) {
	let options = undefined
	// Avoid excessive memory usage when uncompressed size is known
	if (uncompressedSize > 0) {
		options = {
			bufferType: 0,	// 0 = BLOCK, 1 = ADAPTIVE
			bufferSize: uncompressedSize
		}
	}
	// Inflate
	const inflateTask = new Zlib.Inflate(new Uint8Array(buffer), options)
	return inflateTask.decompress()
}

function inflateBlob(blob) {
	return new Promise((resolve, reject) => {
		blob.arrayBuffer()
			.then(buffer => {
				// Split buffer
				const sizeBuffer = buffer.slice(0, 4)
				const dataBuffer = buffer.slice(4)
				// Find uncompressed size (Uint32)
				const uncompressedSize = new Uint32Array(sizeBuffer)[0]
				// Inflate data
				const inflatedBuffer = inflateBuffer(dataBuffer, uncompressedSize)
				// Resolve as Blob
				const inflatedBlob = new Blob([inflatedBuffer])
				resolve(inflatedBlob)
			})
			.catch(e => reject(e))
	})
}

export {inflateBuffer, inflateBlob}