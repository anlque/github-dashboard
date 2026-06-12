import path from 'node:path';
import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';

function createGithubProxy(
  token: string | undefined,
): Record<string, string | ProxyOptions> {
  return {
    '/api/github': {
      target: 'https://api.github.com',
      changeOrigin: true,
      rewrite: (requestPath: string) => requestPath.replace(/^\/api\/github/, ''),
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('Accept', 'application/vnd.github+json');
          proxyReq.setHeader('User-Agent', 'dashboard-github-insights');

          if (token) {
            proxyReq.setHeader('Authorization', `Bearer ${token}`);
          }
        });
      },
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const githubToken = env.GITHUB_TOKEN;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: createGithubProxy(githubToken),
    },
    preview: {
      proxy: createGithubProxy(githubToken),
    },
  };
});
