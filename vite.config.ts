import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

//Two builds are produced:
//  - The default build is the ES module consumed by bundlers. All dependencies are left external so that
//    consuming apps share a single copy of lit/shimi/chroma-js with the components.
//  - The 'cdn' build (vite build --mode cdn) is a self-contained IIFE for use from a plain <script> tag.
//    Lit & chroma-js are bundled in, but shimi is read from the global 'shimi' variable, so that pages
//    loading shimi from a CDN share the same copy with the components.
export default defineConfig(({ mode }) => {
    if (mode == 'cdn') {
        return {
            publicDir: false,
            build: {
                emptyOutDir: false,
                lib: {
                    entry: './src/index.ts',
                    name: 'shimiWc',
                    formats: ['iife'],
                    fileName: () => 'shimi-wc.iife.js'
                },
                rollupOptions: {
                    external: ['shimi'],
                    output: { globals: { shimi: 'shimi' } }
                }
            }
        };
    }

    return {
        publicDir: false,
        plugins: [
            dts({ include: ['src'], exclude: ['src/stories', 'src/vite-env.d.ts'], rollupTypes: true })
        ],
        build: {
            lib: {
                entry: './src/index.ts',
                formats: ['es'],
                fileName: () => 'index.js'
            },
            rollupOptions: {
                external: [/^lit($|\/)/, /^@lit\//, 'shimi', 'chroma-js']
            }
        }
    };
});