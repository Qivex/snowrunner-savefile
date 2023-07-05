<template>
	<div class="fog pointer">
		<img :src="imgurl"/>
		<div class="overlay"></div>
	</div>
</template>

<script>
import {decodeFogFile} from "../tools/decode.js"

export default {
	name: "FogMap",
	props: {
		fogfile: {
			type: File,
			required: true,
			validator(file) {
				return file.name.startsWith("fog_level_")
			}
		}
	},
	data() {
		return {
			title: undefined,
			timestamp: undefined,
			imgurl: undefined
		}
	},
	mounted() {
		decodeFogFile(this.fogfile)
			.then(url => this.imgurl = url)
			.catch(e => console.log(e))
	}
}
</script>

<style>
.fog {
	position: relative;	/* Required for absolute positioning of overlay */
	outline: 1px solid indigo;
}

.fog img {
	display: block;	/* Fixes 4px margin-bottom from inline */
	max-width: 160px;
	max-height: 160px;
}

/* Overlay covers entire image */
.fog .overlay {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-image: url(icons/enlarge.svg);
	background-position: center;
	background-size: 4rem 4rem;
	background-repeat: no-repeat;
	background-color: rgba(50,50,50,0.5);
	opacity: 0;
	transition: opacity 0.5s ease;
}

/* Only visible on hover */
.fog .overlay:hover {
	opacity: 1;
}
</style>