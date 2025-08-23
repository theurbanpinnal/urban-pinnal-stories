import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { readdirSync } from "fs";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// A simple plugin to proxy /api requests to our Vercel functions
// This allows `vite dev` to run the functions from the /api directory
// without needing `vercel dev`
const vercelApiProxy = () => ({
  name: 'vercel-api-proxy',
  configureServer(server) {
    // --- DEBUGGING STEP ---
    // Log the env variable when the server starts to check if it's loaded from .env
    console.log(
      `\n[API PROXY DEBUG] Checking for VITE_SHEETS_WEBHOOK_URL...`,
      `\nValue: ${process.env.VITE_SHEETS_WEBHOOK_URL || 'NOT FOUND'}\n`
    );

    const apiDir = path.resolve(__dirname, 'api');
    const apiFiles = readdirSync(apiDir).filter(file => file.endsWith('.ts'));

    server.middlewares.use(async (req, res, next) => {
      if (!req.url || !req.url.startsWith('/api/')) {
        return next();
      }

      const [apiPath] = req.url.split('?');
      const functionName = apiPath.substring(5); // remove /api/
      const apiFile = `${functionName}.ts`;

      if (!apiFiles.includes(apiFile)) {
        res.statusCode = 404;
        res.end(`Serverless function ${functionName} not found`);
        return;
      }

      try {
        const modulePath = path.join(apiDir, apiFile);
        const module = await server.ssrLoadModule(modulePath);
        const handler = module.default;

        // Collect body
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          if (body) {
            try {
              (req as VercelRequest).body = JSON.parse(body);
            } catch (e) {
              (req as VercelRequest).body = body;
            }
          }
          
          (req as VercelRequest).query = Object.fromEntries(new URLSearchParams(req.url.split('?')[1] || '').entries());


          // Simple compatibility layer for res.status() and res.json()
          (res as VercelResponse).status = (statusCode) => {
            res.statusCode = statusCode;
            return res as VercelResponse;
          };

          (res as VercelResponse).json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };

          await handler(req as VercelRequest, res as VercelResponse);
        });

      } catch (error) {
        console.error(`Error processing ${req.url}:`, error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });
  }
});

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
    vercelApiProxy(),
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
