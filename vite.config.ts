import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => ({
	server: {
		port: 8000,
	},
	css: {
		postcss: {
			plugins: [autoprefixer],
		},
	},
	plugins: [tsconfigPaths()],
}));
