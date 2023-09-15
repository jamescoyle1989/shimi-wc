import { defineConfig } from 'vite';

export default defineConfig({
    publicDir: false,
    build: {
        lib: {
            entry: './src/index.ts',
            formats: ['es', 'cjs'],
            fileName: (format) => {
                if (format == 'es') return 'index.mjs';
                if (format == 'cjs') return 'index.cjs';
                return `index.${format}.js`;
            }
        }
    }
});