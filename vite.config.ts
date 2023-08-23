import { defineConfig } from 'vite';

export default defineConfig({
    publicDir: false,
    build: {
        lib: {
            entry: './src/index.ts',
            formats: ['es', 'cjs'],
            fileName: (format) => {
                if (format == 'es') return 'shlit.mjs';
                if (format == 'cjs') return 'shlit.cjs';
                return `shlit.${format}.js`;
            }
        }
    }
});