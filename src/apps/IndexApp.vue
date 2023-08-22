<template>
	<nav>
		<img class="logo" src="logo.svg"/>
		<InlineSettings v-if="isDesktop"/>
		<div class="langselect">
			<img
				v-for="lang in availableLanguages"
				class="pointer"
				:src="`icons/flags/${lang}.svg`"
				:alt="lang"
				:class="{selected: lang === currentLanguage}"
				@click.left="currentLanguage = lang"
			/>
		</div>
	</nav>
	<main>
		<component :is="viewComponent"/>
	</main>
	<footer v-if="!isDesktop">
		<InlineSettings/>
	</footer>
</template>

<script>
import Panel from "../components/Panel.vue"

import InlineSettings from "../components/InlineSettings.vue"

import UploadView from "../components/UploadView.vue"
import SummaryView from "../components/SummaryView.vue"
import DetailView from "../components/DetailView.vue"
import EditorView from "../components/EditorView.vue"

export default {
	name: "IndexApp",
	inject: ["currentLanguage", "defaultLanguage", "availableLanguages", "translate"],
	components: {
		Panel,
		InlineSettings,
		UploadView,
		SummaryView,
		DetailView,
		EditorView
	},
	data() {
		return {
			isDesktop: window.matchMedia("(any-pointer: fine)").matches,
			currentSlot: "slot1",
			currentView: "summary",
			currentGrouping: "region",
			views: ["summary", "details", "editor"]
		}
	},
	computed: {
		viewComponent() {
			const mapping = {
				summary: "SummaryView",
				details: "DetailView",
				editor: "EditorView"
			}
			return mapping[this.currentView]
		}
	},
	methods: {
		selectSlot(newSlot) {
			this.currentSlot = newSlot
		},
		selectView(newView) {
			this.currentView = newView
		},
		selectGrouping(newGrouping) {
			this.currentGrouping = newGrouping
		}
	},
	provide() {
		return {
			selectSlot: this.selectSlot,
			selectView: this.selectView,
			selectGrouping: this.selectGrouping
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

nav,footer {
	width: 100vw;
	height: 3rem;
	padding-inline: 0.5rem;
	background-color: blue;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}

nav {
	border-bottom: 1px solid #fff;
}

footer {
	position: absolute;
	bottom: 0;
	border-top: 1px solid #fff;
}

.logo {
	margin-inline-end: auto;	/* Force to left */
}

.langselect {
	margin-inline-start: auto;	/* Force to right */
	display: flex;
	column-gap: 1rem;
	justify-items: center;
}

.langselect img {
	width: 2rem;
	border-radius: 1rem;
}

.langselect .selected {
	outline: 2px solid white;
}

main {
	/* Force content to center & fill available width */
	width: 100%;
	display: grid;
	grid-template-columns: 1fr;
	grid-auto-rows: auto;
	margin-inline: auto;
	/* Scroll main instead of body */
	max-height: calc(100vh - 6rem);
	overflow-y: auto;
}

@media (min-width: 50rem) {
	/* Limit width */
	main {
		width: 50rem;
	}
}

@media (any-pointer: fine) {
	/* Would cause blue outline on mobile (https://stackoverflow.com/a/66209706) */
	.pointer {
		cursor: pointer;
	}

	/* No footer on desktop */
	main {
		max-height: calc(100vh - 3rem);
	}
}
</style>