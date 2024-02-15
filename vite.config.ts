import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
	if (command === "serve") {
		//開発環境設定
		return {
			server: {
				port: 8000,
			},
		};
	}

	//本番環境設定
	return {
		css: {
			postcss: {
				plugins: [autoprefixer],
			},
		},
	};
});
