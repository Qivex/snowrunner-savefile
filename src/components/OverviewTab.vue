<template>
	<input type="file" accept=".cfg" multiple @change="onFileSelect"/>
	<div class="fogmaps">
		<div v-for="file in fogfiles">
			<FogMap :fogfile="file"/>
		</div>
	</div>
</template>

<script>
import FogMap from "../components/FogMap.vue"

export default {
	name: "OverviewTab",
	components: {
		FogMap
	},
	data() {
		return {
			fogfiles: []
		}
	},
	methods: {
		onFileSelect(e) {
			for (const file of e.target.files) {
				if (file.name.startsWith("fog_level_")) {
					this.fogfiles.push(file)
				}
			}
		}
	},
	mounted() {}
}
</script>

<style>
@import url(../style/base.css);

.fogmaps {
	display: grid;
	grid-template-columns: repeat(auto-fill, 160px);
	grid-auto-rows: 160px;
	height: 100%;
}
</style>