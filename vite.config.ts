import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ['**/*.PNG', '**/*.JPG', '**/*.JPEG', '**/*.GIF', '**/*.WEBP'],
  // Production build optimizations
  build: {
    // Raise warning limit or adjust as needed
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual vendor chunking to improve cacheability and reduce initial bundle size
        manualChunks: {
          react: [
            'react',
            'react-dom',
            'react-dom/client'
          ],
          'react-router': [
            'react-router-dom',
            'react-router'
          ],
          'tanstack-query': [
            '@tanstack/react-query'
          ],
          shadcn: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip'
          ]
        }
      }
    }
  },
}));
