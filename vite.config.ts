import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { readdirSync } from "fs";

// A simple plugin to proxy /api requests to our Vercel functions
// This allows `vite dev` to run the functions from the /api directory
// without needing `vercel dev`
const vercelApiProxy = (env: Record<string, string>) => ({
  name: 'vercel-api-proxy',
  configureServer(server: any) {
    // --- DEBUGGING STEP ---
    // Log the env variable when the server starts to check if it's loaded
    // Now we use the `env` object passed into the plugin
    console.log(
      `\n[API PROXY DEBUG] Checking for VITE_SHEETS_WEBHOOK_URL...`,
      `\nValue: ${env.VITE_SHEETS_WEBHOOK_URL || 'NOT FOUND'}\n`
    );

    const apiDir = path.resolve(__dirname, 'api');
    const apiFiles = readdirSync(apiDir).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (!req.url || !req.url.startsWith('/api/')) {
        return next();
      }

      const [apiPath] = req.url.split('?');
      const functionName = apiPath.substring(5); // remove /api/

      // Resolve .ts or .js for local dev
      let apiFile = `${functionName}.ts`;
      if (!apiFiles.includes(apiFile)) {
        apiFile = `${functionName}.js`;
      }

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
        req.on('data', (chunk: any) => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          if (body) {
            try {
              (req as any).body = JSON.parse(body);
            } catch (e) {
              (req as any).body = body;
            }
          }
          
          (req as any).query = Object.fromEntries(new URLSearchParams(req.url.split('?')[1] || '').entries());


          // Simple compatibility layer for res.status() and res.json()
          (res as any).status = (statusCode: number) => {
            res.statusCode = statusCode;
            return res as any;
          };

          (res as any).json = (data: unknown) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };

          await handler(req as any, res as any);
        });

      } catch (error) {
        console.error(`Error processing ${req.url}:`, error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });
  }
});

const corsMiddleware = () => ({
  name: 'dev-cors-middleware',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      // Allow all origins in development
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Shopify-Storefront-Access-Token, X-Requested-With');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }
      next();
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' ensures all variables are loaded, not just those prefixed with VITE_.
  const env = loadEnv(mode, process.cwd(), '');

  return {
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
      proxy: {
        '/shopify': {
          target: 'https://enzqhm-e2.myshopify.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/shopify/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Forward Shopify access token header
              if (req.headers['x-shopify-storefront-access-token']) {
                proxyReq.setHeader('X-Shopify-Storefront-Access-Token', req.headers['x-shopify-storefront-access-token']);
              }
              
              // Add the Storefront API token from environment variables if not present in headers
              if (!req.headers['x-shopify-storefront-access-token'] && env.VITE_SHOPIFY_STOREFRONT_API_TOKEN) {
                proxyReq.setHeader('X-Shopify-Storefront-Access-Token', env.VITE_SHOPIFY_STOREFRONT_API_TOKEN);
              }
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              // Remove existing CORS headers from Shopify response
              delete proxyRes.headers['access-control-allow-origin'];
              delete proxyRes.headers['access-control-allow-methods'];
              delete proxyRes.headers['access-control-allow-headers'];
            });
          }
        }
      },
    },
    plugins: [
      react(),
      corsMiddleware(),
      vercelApiProxy(env),
      mode === 'development' && componentTagger(),
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
  }
});
