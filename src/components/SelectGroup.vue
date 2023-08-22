<template>
	<div class="selectgroup" :style="{'--dm': dialogMargin}">
		<button @click.left="toggleDialog">{{translate(`opt_${currentOption}`)}}</button>
		<dialog ref="options" :style="{left: left+'px'}">
			<p>{{translate(label)}}</p>
			<div class="options">
				<button
					v-for="(option,index) in options"
					@click.left="selectOption(index)"
					:class="{selected: index === current}"
				>
					{{translate(`opt_${option}`)}}
				</button>
			</div>
		</dialog>
	</div>
</template>

<script>
export default {
	name: "SelectGroup",
	inject: ["translate"],
	props: {
		label: String,
		options: Array,
		default: Number,
		onSelect: Function
	},
	data() {
		return {
			current: this.default || 0,
			left: 0,
			dialogMargin: 0.1	// = 10%
		}
	},
	computed: {
		currentOption() {
			return this.options[this.current] || undefined
		},
		dialog() {
			return this.$refs.options
		}
	},
	methods: {
		toggleDialog(event) {
			if (this.dialog.open) {
				this.closeDialog()
				return
			}
			// Adjust dialog position:
			this.dialog.show()
			// 1) Get required values
			let rect = event.target.getBoundingClientRect()
			const totalWidth = window.innerWidth
			const buttonWidth = rect.width
			const buttonX = rect.x
			const dialogWidth = this.dialog.getBoundingClientRect().width
			// 2) Determine position of dialog
			let left = buttonX + (buttonWidth - dialogWidth) / 2	// Centered below button
			// 3) Respect margins
			const minLeftMargin = totalWidth * this.dialogMargin
			const maxLeftMargin = totalWidth - minLeftMargin - dialogWidth
			if (left < minLeftMargin) {
				left = minLeftMargin
			}
			if (left > maxLeftMargin) {
				left = maxLeftMargin
			}
			// 4) Apply calculated position
			this.left = left
		},
		closeDialog() {
			this.dialog.close()
		},
		selectOption(index) {
			this.current = index
			this.onSelect?.(this.currentOption)
			this.closeDialog()
		}
	}
}
</script>

<style>
.selectgroup dialog {
	/* overwrite defaults */
	margin: 0;	
	padding: 0;	/* No padding here (max-width ignores it) -> margin on children */
	/* positioning */
	max-width: calc(100% - calc(200% * var(--dm)));	/* dialogInlineMargin on both sides */
	position: absolute;
	top: 2.7rem;
	/* styling */
	color: white;
	background-color: black;
	border: 1px solid white;
}

.selectgroup p {
	margin-top: 0.5rem;
	margin-left: 0.5rem;
}

.selectgroup .options {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin: 0.5rem;
	gap: 0.5rem;
}

@media (any-pointer: coarse) {
	.selectgroup dialog {
		top: auto;
		bottom: 2.7rem;
	}
}

.selectgroup dialog::backdrop {
	background-color: rgba(0,0,0,0.5);
	backdrop-filter: blur(1px);
}

.selectgroup button {
	height: 2rem;
	color: white;
	background-color: #444;
	border: 1px solid #666;
	border-radius: 6px;
}

.selectgroup button.selected {
	background-color: #777;
}
</style>