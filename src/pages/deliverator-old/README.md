# DEPRECATED

This folder is **deprecated** and will be removed in a future update.

## Migration Complete

This project has been migrated to use Astro's dynamic slug-based routing system.

All project pages are now generated from the `src/pages/[slug]/` directory, which automatically creates pages for all JSON files in `src/data/projectData/`.

### Old Structure (Deprecated)
- `src/pages/deliverator/index.astro`
- `src/pages/deliverator/splash.astro`
- `src/pages/deliverator/project-info.astro`

### New Structure (Active)
- `src/pages/[slug]/index.astro` - Generates pages for all projects
- `src/pages/[slug]/splash.astro` - Generates splash pages for all projects
- `src/pages/[slug]/project-info.astro` - Generates info pages for all projects

### URLs Remain Unchanged
- `/deliverator/` - AR experience
- `/deliverator/splash` - Splash page
- `/deliverator/project-info` - Info page

### Adding New Projects
To add a new AR project, simply create a new JSON file in `src/data/projectData/` and all three pages will be automatically generated.

---

**Note:** This folder is kept temporarily for reference. It will be removed once the migration is fully verified.
