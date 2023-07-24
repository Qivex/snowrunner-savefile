import {decodeDDSFile} from "./dds.js"
import {inflateBlob} from "./inflate.js"

class MudTile {
	constructor(x, y, tile) {
		this.x = x
		this.y = y
		this.tile = tile
	}

	decode() {
		return decodeDDSFile(this.tile)
	}
}

/* Format:
- List of DDS files with 256x256 tiles
- DDS data has only 2 channels (Red & Alpha)
- Each DDS file is prepended with a custom 2413 byte header
*/
const CUSTOM_HEADER_LENGTH = 2413
const DDS_HEADER_LENGTH = 128
const DDS_DATA_LENGTH = 256 * 256 * 2
const BLOCK_LENGTH = CUSTOM_HEADER_LENGTH + DDS_HEADER_LENGTH + DDS_DATA_LENGTH

function decodeMudMaps(file) {
	return new Promise((resolve, reject) => {
		inflateBlob(file)
			.then(stsBlob => {
				// Test if file is valid
				const length = stsBlob.size
				if (length % BLOCK_LENGTH !== 0) {
					reject("Mudmap file has unexpected size")
				}
				// Deduce amount of mud tiles from file length
				const blockCount = length / BLOCK_LENGTH
				// Resolve with array of MudTiles (which can be decoded individually -> dynamic load instead of long wait!)
				const blockDecodeTasks = []
				for (let block = 0; block < blockCount; block++) {
					blockDecodeTasks.push(new Promise((resolve, reject) => {
						const blockBlob = stsBlob.slice(BLOCK_LENGTH * block, BLOCK_LENGTH * (block + 1))

						const coordinates = blockBlob.slice(0, 8)	// First 2 values are coordinates of tile
						const ddsTile = blockBlob.slice(CUSTOM_HEADER_LENGTH)

						coordinates.arrayBuffer()
							.then(buffer => {
								const coordinates = new Uint32Array(buffer)
								const x = coordinates[0]
								const y = coordinates[1]
								resolve(new MudTile(x, y, ddsTile))
							})
					}))
				}
				Promise.all(blockDecodeTasks)
					.then(mudtiles => resolve(mudtiles))
			})
	})
}

export {decodeMudMaps}