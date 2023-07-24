import { imageData2ObjectURL } from "./png"

// dwFlags
const DDSD_CAPS = 0x1
const DDSD_HEIGHT = 0x2
const DDSD_WIDTH = 0x4
const DDSD_PITCH = 0x8
const DDSD_PIXELFORMAT = 0x1000
const DDSD_MIPMAPCOUNT = 0x20000
const DDSD_LINEARSIZE = 0x80000
const DDSD_DEPTH = 0x800000

// dwCaps
const DDSCAPS_COMPLEX = 0x8
const DDSCAPS_MIPMAP = 0x400000
const DDSCAPS_TEXTURE = 0x1000

function ddsBlob2ImageData(blob) {
	return new Promise((resolve, reject) => {
		// Decode DDS header (https://learn.microsoft.com/en-us/windows/win32/direct3ddds/dds-header)
		blob.slice(0, 128)
			.arrayBuffer()
			.then(header => {
				// Assign values from header array
				const [
					ddsSignature, // "DDS "
					headerLength, // dwSize (124)
					usedFeatures, // dwFlags
					pixelHeight,  // dwHeight
					pixelWidth,   // dwWidth
					dataLength,   // dwPitchOrLinearSize
					volumeDepth,  // dwDepth
					mmCount,      // dwMipMapCount
					r1a, r1b, r1c, r1d, r1e, r1f, r1g, r1h, r1i, r1j, r1k,
					              // dwReserved1 (11 unused DWORDs)
					formatLength, // ddspf.dwSize (32)
					formatFlags,  // ddspf.dwFlags
					customFormat, // ddspf.dwFourCC
					pixelLength,  // ddspf.dwRGBBitCount
					maskR,        // ddspf.dwRBitMask
					maskG,        // ddspf.dwGBitMask
					maskB,        // ddspf.dwBBitMask
					maskA,        // ddspf.dwABitMask
					surfaceType,  // dwCaps
					cubemapInfo,  // dwCaps2
					c3, c4, r2    // dwCaps3, dwCaps4, dwReserved2 (unused)
				] = new Uint32Array(header)
				// Reject if anything is invalid (only basic checks)
				const isValidHeader = new Boolean(
					ddsSignature === 0x20534444 &&	// "DDS "
					headerLength === 124 &&
					usedFeatures & DDSD_CAPS &&
					usedFeatures & DDSD_HEIGHT &&
					usedFeatures & DDSD_WIDTH &&
					usedFeatures & DDSD_PIXELFORMAT && 
					formatLength === 32 &&
					surfaceType & DDSCAPS_TEXTURE
				)
				if (!isValidHeader) {
					reject("Invalid DDS header")
					return
				}
				// Load image data
				blob.slice(128, 128 + dataLength)
					.arrayBuffer()
					.then(data => {
						// Expect specific resource format: D3DFMT_A8R8G8B8
						if (pixelLength === 32 && maskR === 0xff0000 && maskG === 0xff00 && maskB === 0xff && maskA === 0xff000000) {
							// Format used in sts_
							let bgra = new Uint8ClampedArray(data)
							// Reorder from BGRA to RGBA
							const area = pixelWidth * pixelHeight
							let rgba = new Uint8ClampedArray(area * 4)
							for (let i=0; i<area; i++) {
								rgba[4*i+0] = bgra[4*i+2]	// Red
								rgba[4*i+1] = bgra[4*i+1]	// Green
								rgba[4*i+2] = bgra[4*i+0]	// Blue
								rgba[4*i+3] = bgra[4*i+3]	// Alpha
							}
							// Resolve as ImageData
							resolve(new ImageData(rgba, pixelWidth))
						} else if (pixelLength === 16 && maskR === 0xff0000 && maskA === 0xff000000) {
							// Format used in sts_mudmaps_
							let ra = new Uint8ClampedArray(data)
							// Reorder from RA to RGBA
							const area = pixelWidth * pixelHeight
							let rgba = new Uint8ClampedArray(area * 4)
							for (let i=0; i<area; i++) {
								rgba[4*i+0] = ra[2*i+0]	// Red
								rgba[4*i+1] = 0			// Green
								rgba[4*i+2] = 0			// Blue
								rgba[4*i+3] = ra[2*i+1]	// Alpha
							}
							// Resolve as ImageData
							resolve(new ImageData(rgba, pixelWidth))
						} else {
							reject("Cant handle resource format")
							/* Todo:
							- Different UintArray (pixelLength)
							- Find values using bit masks (maskR etc.)
							- Map values to 0..255 (eg. R3G3B2)
							*/
						}
					})
			})
	})
}

function decodeDDSFile(file) {
	return new Promise((resolve, reject) => {
		ddsBlob2ImageData(file)
			.then(imageData => imageData2ObjectURL(imageData))
			.then(url => resolve(url))
			.catch(e => reject(e))
	})
}


export {decodeDDSFile}