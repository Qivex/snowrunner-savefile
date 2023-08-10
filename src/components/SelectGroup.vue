<template>
	<div class="selectgroup">
		<p>{{translate(label)}}</p>
		<button v-for="(option,index) in options" @click.left="selectOption(index)" :class="{selected: index === current}">{{translate(option)}}</button>
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
			current: this.default || 0
		}
	},
	computed: {
		currentOption() {
			return this.options[this.current] || undefined
		}
	},
	methods: {
		selectOption(index) {
			this.current = index
			this.onSelect?.(this.currentOption)
		}
	}
}
</script>

<style>
.selectgroup {
	margin: 0.5rem;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.selectgroup p {
	margin-block: 0;
	margin-inline: 0.5rem;
}

.selectgroup button {
	height: 2rem;
	padding-inline: 1rem;
	margin-inline: 0.5rem;
	background-color: transparent;
	border: none;
	border-radius: 1rem;
	outline: 2px solid red;
}

.selectgroup button.selected {
	background-color: white;
}
</style>