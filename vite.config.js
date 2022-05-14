import { defineConfig } from 'vite'
import pugPluginTest from './vite-plugin/pug'
import path from 'path'
import glob from 'glob'
import legacy from '@vitejs/plugin-legacy'
const options = { pretty: true, localImports: true } // FIXME: pug pretty is deprecated!
const locals = {}

export function excludePrivate(item) {
  return !path.basename(item).startsWith('_')
}

export function getRootDir(excludeFn = () => true) {
  return glob
    .sync('src/**/*.html')
    .filter(excludeFn)
    .map((item, index) => {
      return {
        [index]: item
      }
    })
    .reduce((memo, cur) => {
      return {
        ...memo,
        ...cur
      }
    }, {})
}

export default defineConfig({
  root: path.join(__dirname, 'src'),
  publicPath: path.join(__dirname, 'public'),
  plugins: [
    pugPluginTest(options, locals),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  server: {
    host: true
  },
  build: {
    target: 'es2015',
    manifest: true,
    outDir: path.join(__dirname, 'dist'),
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }, // 去除 console debugger
    rollupOptions: {
      input: getRootDir(excludePrivate),
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      }
    }
  }
})
