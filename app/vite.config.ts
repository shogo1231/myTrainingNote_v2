// / <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), viteTsconfigPaths()],
  server: {
    // ホットリロード対策用（なくても動いてたが一応公式に書いてあったので適用している）
    watch: {
      usePolling: true,
    },
    proxy: {
      '/workoutAPI': {
        target: 'http://localhost:3000/',  // バックエンドのURL
        changeOrigin: true, // オリジンヘッダを変更する
        // rewrite: (path) => path.replace(/^\/workoutAPI/, ''), // URLの一部を書き換える。必要に応じて適用するが今回は書き換え不要。
      },
    },
    fs: {
      cachedChecks: false
    },
    host: '0.0.0.0', // 外部接続を許可
    port: 5174,      // 必要ならポートを変更(docker環境、vscodeデバッグ環境ごとにportを分けるなど)
  },
})
