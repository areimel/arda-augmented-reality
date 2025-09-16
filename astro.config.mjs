import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: import.meta.env.DEV ? 'http://localhost:4321' : 'https://interzone-ar.netlify.app',
  vite: {
    define: {
      __BASE_URLS__: JSON.stringify({
        localhost: 'http://localhost:4321',
        staging: 'https://staging-interzone-ar.netlify.app',
        live: 'https://interzone-ar.netlify.app'
      })
    }
  }
});
