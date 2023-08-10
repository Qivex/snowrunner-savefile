<template>
	<NavBar/>
	<main>
		<SettingsPanel/>
		<Panel class="content">
			<component :is="viewComponent"/>
		</Panel>
	</main>
	<!--
	<TabSelect class="maintabs" :tabnames="['Summary','Details','Editor']">
		<OverviewTab/>
		<DetailTab/>
		<EditorTab/>
	</TabSelect>
	-->
</template>

<script>
import NavBar from "../components/NavBar.vue"

import Panel from "../components/Panel.vue"
import SettingsPanel from "../components/SettingsPanel.vue"

import UploadView from "../components/UploadView.vue"
import SummaryView from "../components/SummaryView.vue"
import DetailView from "../components/DetailView.vue"
import EditorView from "../components/EditorView.vue"

export default {
	name: "IndexApp",
	inject: ["currentLanguage", "defaultLanguage"],
	components: {
		NavBar,
		Panel,
		SettingsPanel,
		UploadView,
		SummaryView,
		DetailView,
		EditorView
	},
	data() {
		return {
			currentView: "Summary"
		}
	},
	computed: {
		viewComponent() {
			return this.currentView + "View"
		}
	},
	mounted() {
		this.currentLanguage = "en" || this.defaultLanguage
	}
}
</script>

<style>
body {
	width: 100%;
	margin: 0px;
	padding: 0px;
	color: white;
	background-color: #111;
}

p {
	margin: 0;
}

main {
	/* Force content to full width & center */
	width: 100%;
	display: grid;
	grid-template-columns: 1fr;
	grid-auto-rows: auto;
	margin-inline: auto;
	/* Scroll main instead of body */
	max-height: calc(100vh - 2.5rem);
	overflow-y: auto;
}

@media (min-width: 50rem) {
	main {
		width: 50rem;
	}
}

/* Would cause blue outline on mobile (https://stackoverflow.com/a/66209706) */
@media (any-pointer: fine) {
	.pointer {
		cursor: pointer;
	}
}
</style>