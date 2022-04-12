import {defineConfig} from 'vite';
import pugPlugin from "vite-plugin-pug"
import path from 'path';
import glob from 'glob';

const options = {pretty: true, localImports: true} // FIXME: pug pretty is deprecated!
const locals = {}

export function excludePrivate(item) {
    return !path.basename(item).startsWith('_')
}

export function getRootDir(excludeFn = () => true) {
    return glob.sync("src/**/*.html").filter(excludeFn).map((item, index) => {
        return {
            [index]: item
        };
    }).reduce((memo, cur) => {
        return {
            ...memo,
            ...cur
        };
    }, {});
}

export default defineConfig({
    root: path.join(__dirname, 'src'),
    publicPath: path.join(__dirname, 'public'),
    plugins: [pugPlugin(options, locals)],
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        }
    },
    build: {
        outDir: path.join(__dirname, 'dist'),
        minify: 'terser',
        rollupOptions: {
            input: getRootDir(excludePrivate),
            output: {
                chunkFileNames: 'static/js/[name]-[hash].js',
                entryFileNames: 'static/js/[name]-[hash].js',
                assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
            }
        },
    }
})