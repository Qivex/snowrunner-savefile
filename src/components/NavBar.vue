<template>
	<nav>
		<img src="logo.svg"/>
		<div class="viewselect">
			<div class="viewoption pointer" v-for="view in views">{{view}}</div>
		</div>
		<img src="settings.svg"/>
	</nav>
</template>

<script>
export default {
	name: "NavBar",
	inject: ["selectView"],
	data() {
		return {
			views: ["Overview", "Details", "Editor"]
		}
	}
}
</script>

<style>
nav {
	height: 2.5rem;
	width: 100vw;
	padding-inline: 0.5rem;
	background-color: blue;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	border-bottom: 1px solid #fff;
}

.viewselect {
	height: 100%;
	display: grid;
	grid-template-columns: repeat(3, 6rem);
	margin-inline: auto;	/* Force other content outwards */
}

.viewoption {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>