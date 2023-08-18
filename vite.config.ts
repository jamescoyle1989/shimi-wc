import { defineConfig } from 'vite';

export default defineConfig({
    publicDir: false,
    build: {
        lib: {
            entry: './src/index.ts',
            formats: ['es', 'cjs'],
            fileName: (format) => {
                if (format == 'es') return 'elements.mjs';
                if (format == 'cjs') return 'elements.cjs';
                return `elements.${format}.js`;
            }
        }
    }
});