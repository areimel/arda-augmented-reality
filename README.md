# Interzone Augmented Reality
Pre-packaged Augmented Reality projects for easy deployment.

This project currently uses A-Frame and Mind-AR as its core engines, with AR.js options coming soon for additional functionality. The project also uses Astro as its overarching framework - providing a simple way to manage project and component structure, 

This project is the parent project of [Grovery-AR](https://github.com/thegrovery/grovery-augmented-reality).

## Resources
Important Links:
- Mind-AR Links:    
    - [Mind AR - Main AR Script](https://github.com/hiukim/mind-ar-js)
    - [Mind AR - Github Repository](https://github.com/hiukim/mind-ar-js)
    - [Compile Marker Images](https://hiukim.github.io/mind-ar-js-doc/tools/compile/)
    - [Mind AR - Image Tracking Examples](https://hiukim.github.io/mind-ar-js-doc/examples/summary)
    - [Tracking Config Options](https://hiukim.github.io/mind-ar-js-doc/quick-start/tracking-config)
- AR.js Links:
    - [AR.js - Github Repository](https://github.com/AR-js-org/AR.js)
    - [AR.js - Documentation](https://ar-js-org.github.io/AR.js-Docs/)
- 8th Wall Links:
    - [8th Wall - Green Screen Video Code Source](https://www.8thwall.com/playground/alpha-video-slam-aframe/code/)
- A-Frame Components:
    - [Look-At Component](https://www.npmjs.com/package/aframe-look-at-component)
- Misc Tools:
    - [QRCode.js](https://github.com/davidshimjs/qrcodejs)
    - [Gif to MP4 Conversion](https://ezgif.com/gif-to-mp4) 
        - Note: replace with command line tool later
    - [Stacher - Download Videos](https://stacher.io/)

## Instructions

How to add a new sub-project:
1. Set up the project data by ading a new `.json` file to the `src/data/projectData` folder by copying the `general-marker-template.json` file or another template file.
2. Add the new project pages to the `src/pages` folder by cloning another similar project or template.
3. Update the new pages to use your new json file.
4. Add any customizations you need.
5. Ready to go!

---

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
