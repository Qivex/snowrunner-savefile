# Snowrunner Savefile Analysis
My Journey of analysing and displaying the Snowrunner savefiles

## Motivation
I consider myself a completionist when it comes to gaming. [SnowRunner](https://www.focus-entmt.com/en/games/snowrunner) has been quite an enjoyable and relaxing experience from start to finish. I would argue however that even after the ingame progress indicator hits 100% there are still more activities that could be completed. This includes clearing absolutely all fog, selling all trailers scattered in the world, buying all upgrades (even if they are unused) and more. Some of these can be quite hard to track ingame (good luck finding the last unexplored pixel), therefore I am trying to visualize these more clearly and condensed.

## Inspiration
- [Maprunner.info Save Editor](https://www.maprunner.info/resources/save-editor) (only includes very basic values)
- [Control Save Editor](https://www.nexusmods.com/control/mods/26) was the first save editor I ever used to check for 100%
- [Noclip](https://noclip.website/) by (Jasper)[https://www.youtube.com/@JasperRLZ] made me think I could maybe visualize the mud

## Goals
Summary: Display, explain and edit savefiles
### Basic
- Slot selection
- Group information by region or type
- Progress overview for "true" 100%
### Displayed information
- Achievement & mission progress (ingame 100%)
- Race times
- Unexplored areas
- Unsold trailers
- Missing upgrades (store & world)
- Season 8 Fields
- Mud tracks
### Editor
- Remove unusable vehicles (grayed out after mission)
- Reset mud
- Cheating (increasing rank, giving money, clearing missions, setting race records etc.)
### Scrapped goals
- Nothing yet, but the mud tracks are ambitious and will most likely end up here

## Dependencies
- [Vite](https://vitejs.dev/) with [Vue](https://vuejs.org/) as plugin
- A minimal [zlib implementation for JS](https://github.com/imaya/zlib.js) (MIT License)

## Build
0. Install [npm](https://docs.npmjs.com/about-npm-versions) (included in Node.js)
1. Clone this repo
2. Run `npm install` to get dependencies
3. For development use `npm run dev`, for build use `npm run build`
4. After build all required files for hosting are found in `/dist` - use `npm run prev` to preview locally
