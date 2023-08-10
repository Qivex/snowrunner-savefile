<template>
	<Panel class="settings">
		<h3>Language</h3>
		<p>EN</p>
		<h3>Slot:</h3>
		<p>1-4</p>
		<SelectGroup :label="'label_groupby'" :options="['opt_region','opt_feature']" :default="1" :onSelect="x => console.log(x)"/>
	</Panel>
</template>

<script>
import Panel from "./Panel.vue"
import SelectGroup from "./SelectGroup.vue"

export default {
	name: "SettingsPanel",
	components: {
		Panel,
		SelectGroup
	},
	mounted() {}
}
</script>

<style>
</style>