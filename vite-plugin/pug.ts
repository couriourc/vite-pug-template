import type {LocalsObject, Options} from "pug"
import {compileFile} from "pug"
import * as pc from "picocolors"

export type PluginOptions = Options & {
    /**
     * Look for pug files in the directory
     * of currently compiled index.html
     * (locally)
     * instead of project root.
     *
     * Can accept a function to determine the option per-html-file.
     */
    localImports?: boolean | ((htmlfile: string) => boolean)
}

export function pugs(filepath: string, options: PluginOptions, locals: LocalsObject) {
    return compileFile(filepath, options)(locals)
}

export default (options, locals) => {
    return {
        name: 'vite:plugin-pug',
        handleHotUpdate({file, server}) {
            if (file.endsWith(".pug")) {
                server?.config.logger.info(`${pc.green(`pug’s hot`)} 🌭 ${pc.cyan(file)}`)
                server.ws.send({
                    type: "full-reload",
                })
            }
        },
        transformIndexHtml: {
            enforce: 'pre',
            transform(html, {filename}) {
                return pugs(filename, options, locals);
            }
        },
    }
}
