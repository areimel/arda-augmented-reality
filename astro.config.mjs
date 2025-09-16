import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import os from 'os';

// Get network IP address for development
function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName of Object.keys(interfaces)) {
    const interfaceInfo = interfaces[interfaceName];
    for (const alias of interfaceInfo) {
      // Handle Node.js version compatibility (string vs number for family)
      const familyV4Value = typeof alias.family === 'string' ? 'IPv4' : 4;
      if (alias.family === familyV4Value && !alias.internal) {
        return `http://${alias.address}:4321`;
      }
    }
  }
  return 'http://localhost:4321'; // Fallback
}

const networkURL = getNetworkIP();

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: import.meta.env.DEV ? networkURL : 'https://interzone-ar.netlify.app',
  server: {
    host: true,
    port: 4321
  },
  vite: {
    define: {
      __BASE_URLS__: JSON.stringify({
        localhost: networkURL,
        staging: 'https://staging-interzone-ar.netlify.app',
        live: 'https://interzone-ar.netlify.app'
      })
    }
  }
});
