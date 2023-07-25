<template>
	<input type="file" accept=".cfg,.pct" multiple @change="onFileSelect"/>
	<div class="fogmaps">
		<div v-for="file in fogfiles">
			<FogMap :fogfile="file"/>
		</div>
	</div>
	<div class="ddsgrid" v-if="ddsimgs.length > 0">
		<img v-for="dds in ddsimgs" :src="dds" class="dds"/>
	</div>
	<div class="mudgrid" v-if="mudtiles.length > 0">
		<img v-for="mud in mudtiles" :src="mud.url" :style="mud.style" class="mud"/>
	</div>
	<img v-for="sts in stsimgs" :src="sts" class="sts"/>
	<img v-if="pct" :src="pct" class="pct"/>
</template>

<script>
import FogMap from "../components/FogMap.vue"

import {decodeDDSFile} from "../decode/dds.js"
import {decodeSTSFile} from "../decode/sts.js"
import {decodeMudMaps} from "../decode/mud.js"
import {decodePCTFile} from "../decode/pct.js"

export default {
	name: "OverviewTab",
	components: {
		FogMap
	},
	data() {
		return {
			fogfiles: [],
			ddsimgs: [],
			stsimgs: [],
			mudtiles: [],
			pct: undefined
		}
	},
	methods: {
		onFileSelect(e) {
			for (const file of e.target.files) {
				if (file.name.startsWith("fog_level_")) {
					this.fogfiles.push(file)
				} else if (file.name.startsWith("dds")) {
					decodeDDSFile(file)
						.then((url, index) => {
							this.ddsimgs[img] = url
						})
						.catch(e => console.log(e))
				} else if (file.name.endsWith(".pct")) {
					decodePCTFile(file)
						.then(url => {
							this.pct = url
						})
				} else if (file.name.startsWith("sts_mudmaps_")) {
					// Todo: These are also mirrored, just like fog & pct
					decodeMudMaps(file)
						.then(mudTiles => {
							console.log(mudTiles.length)
							mudTiles.forEach(tile => {
								tile.decode()
									.then(url => {
										this.mudtiles.push({
											url: url,
											style: {"--x": tile.x, "--y": tile.y}
										})
									})
							})
						})
				} else if (file.name.startsWith("sts")) {
					decodeSTSFile(file)
						.then(url => {
							this.stsimgs.push(url)
						})
						.catch(e => console.log(e))
				}
			}
		}
	},
	mounted() {}
}
</script>

<style>
@import url(../style/base.css);

body {
	background-color: #bbb;
}

.fogmaps {
	display: grid;
	grid-template-columns: repeat(auto-fill, 160px);
	grid-auto-rows: 160px;
}

.ddsgrid {
	--dds: 128px;
	display: grid;
	grid-template-columns: repeat(auto-fit, var(--dds));
	grid-auto-rows: var(--dds);
}

.dds {
	outline: 1px solid red;
	width: var(--dds);
	height: var(--dds);
	image-rendering: pixelated;
}

.mudgrid {
	width: calc(80 * var(--mud));
	margin: 2rem auto;
	background-color: #999;
	--mud: 16px;
	display: grid;
	grid-template-columns: repeat(80, var(--mud));
	grid-template-rows: repeat(80, var(--mud));
	
}

.mud {
	width: var(--mud);
	height: var(--mud);
	grid-column: var(--x);
	grid-row: var(--y);
	image-rendering: pixelated;
}

.sts {
	image-rendering: pixelated;
}

.pct {
	image-rendering: pixelated;
	max-width: 100%;
	margin: 2rem auto;
}
</style>