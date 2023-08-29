<template>
	<Panel>
		<p>Upload View</p>
		<FileUpload
			id="saveupload"
			:accept="accept"
			multiple
			:onChange="processFiles"
		/>
	</Panel>
</template>

<script>
import Panel from "./Panel.vue"
import FileUpload from "./FileUpload.vue"

const reFileExtension = /^.*(\..*)$/

export default {
	name: "UploadView",
	components: {
		Panel,
		FileUpload
	},
	inject: ["translate", "appendError", "clearErrors"],
	data() {
		return {
			accept: ".cfg,.zip,.pct"
		}
	},
	methods: {
		processFiles(files) {
			// Begin new operation -> clear errors from previous
			this.clearErrors()
			// Manual confirmation of all file types
			const allowedTypes = this.accept.split(",")
			const unexpectedTypes = []
			for (let file of files) {
				let valid = false
				// Test each entry of accept-list
				for (let type of allowedTypes) {
					// Either extension or MIME must match
					if (file.name.endsWith(type) || file.type === type) {
						valid = true
						break
					}
				}
				// Keep track of unexpected types
				if (valid === false) {
					let result = reFileExtension.exec(file.name)
					if (result) {
						let ext = result[1]
						if (unexpectedTypes.includes(ext) === false) {
							unexpectedTypes.push(ext)
						}
					}
				}
			}
			// Cancel on any unexpected file
			if (unexpectedTypes.length > 0) {
				this.appendError(this.translate("err_unexpected_types", unexpectedTypes.join(', ')))
				return
			}
			// Do something (placeholder)
			[...files].forEach(file => console.log(file.name))
		},
		onClick() {
			// Open file select
		},
		onDrop(event) {
			// Begin new operation -> Clear errors
			clearErrors()
			// Get dropped items
			const data = event.dataTransfer
			const files = [...data.files]
			// equal to: [...data.items].filter(item => item.kind === "file").map(item => item.getAsFile())
			if (files.length === 0) {
				appendError("nofile")
				return
			}
		}
	},
	mounted() {}
}
</script>

<style>
</style>