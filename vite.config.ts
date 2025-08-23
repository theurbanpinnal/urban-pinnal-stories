import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "frame-ancestors 'none';",
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    },
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
    // Target modern browsers for better performance
    target: 'es2020',
    // Minify more aggressively
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
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
          radix: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-select',
            '@radix-ui/react-popover',
            '@radix-ui/react-navigation-menu'
          ],
          lucide: ['lucide-react'],
          utils: ['clsx', 'class-variance-authority', 'tailwind-merge']
        }
      }
    }
  },
}));
