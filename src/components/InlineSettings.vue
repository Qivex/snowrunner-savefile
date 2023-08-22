<template>
	<div class="settings">
		<!-- Expand & Collapse all Settings into single Gear-Icon -->
		<SelectGroup
			label="label_slot"
			:default="0"
			:options="['slot1','slot2','slot3','slot4']"
			:onSelect="selectSlot"
		/>
		<SelectGroup
			label="label_view"
			:default="0"
			:options="['summary','details','editor']"
			:onSelect="selectView"
		/>
		<SelectGroup
			label="label_groupby"
			:default="0"
			:options="['region','feature']"
			:onSelect="selectGrouping"
		/>
		<!-- Upload more files -->
	</div>
</template>

<script>
import SelectGroup from "./SelectGroup.vue"

export default {
	name: "InlineSettings",
	components: {
		SelectGroup
	},
	inject: ["selectSlot", "selectView", "selectGrouping"]
}
</script>

<style>
.settings {
	display: flex;
	column-gap: 0.5rem;
}
</style>