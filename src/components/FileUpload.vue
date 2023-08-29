<template>
	<label class="fileupload">
		<input
			type="file"
			ref="input"
			:id="id"
			:name="id"
			:accept="accept"
			:multiple="multiple"
			@change.prevent="onFileChange"
		/>
		<div
			class="dropzone pointer"
			@drop.prevent="onFileDrop"
			@dragover.prevent
		>
			<p v-if="files && files.length > 0">
				{{translate("file_count", files.length)}}
			</p>
			<p v-else>
				{{translate("select_files")}}
			</p>
		</div>
	</label>
</template>

<script>
export default {
	name: "FileUpload",
	inject: ["translate"],
	props: {
		id: String,
		accept: String,
		multiple: Boolean,
		onChange: Function,
		onUnexpectedType: Function
	},
	data() {
		return {
			files: undefined
		}
	},
	methods: {
		onFileDrop(event) {
			this.commitFiles(event.dataTransfer.files)
		},
		onFileChange(event) {
			this.commitFiles(event.target.files)
		},
		commitFiles(files) {
			if (files.length > 0) {
				this.files = files
				this.onChange?.(files)
			}
		}
	}
}
</script>

<style>
.fileupload input {
	display: none;
}

.dropzone {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 1rem;
	aspect-ratio: 2/1;
	outline: 2px dashed white;
	border-radius: 2rem;
}

.dropzone::before {
	font-size: 100px;
	content: "+";
}
</style>