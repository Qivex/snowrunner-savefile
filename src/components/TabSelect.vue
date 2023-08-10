<template>
	<div class="tabselect">
		<div class="tabnames">
			<p v-for="(name,index) in tabnames" @click.left="() => selectTab(index)" :class="{current: index === currentTab}" class="pointer">{{name}}</p>
		</div>
		<div class="tabs" ref="tabs">
			<slot/>
		</div>
	</div>
</template>

<script>
export default {
	name: "TabSelect",
	props: {
		tabnames: Array,
		startTab: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			currentTab: 0
		}
	},
	methods: {
		selectTab(index) {
			let c = this.$refs.tabs.children
			// Remove class from previous
			c[this.currentTab].classList.remove("current")
			// Update var
			this.currentTab = index
			// Add class to current tab
			c[index].classList.add("current")
		}
	},
	mounted() {
		this.selectTab(this.startTab)
	}
}
</script>

<style>
.tabnames2 {
	display: flex;
	justify-content: space-around;
}

.tabnames {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(1rem, 1fr));
	grid-auto-rows: 40px;
	gap: 1rem;
}

.tabnames p {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0;
	border-radius: 1rem 1rem 0 0;
	background-color: red;
}

.tabnames .current {
	background-color: lime;
}

.tabs {
	border: 1px solid red;
	padding: 0.5rem;
}

/* Hide all tabs except current */
.tabs > :not(.current) {
	display: none;
}
</style>