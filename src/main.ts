import "phaser";
import "./global.scss";
import Example from "./scenes/Example";

const isDebug = import.meta.env.MODE === "development";

const config: Phaser.Types.Core.GameConfig = {
	width: 480,
	height: 320,
	type: Phaser.AUTO,
	scene: [Example],
	scale: {
		mode: Phaser.Scale.FIT, // SHOW_ALLに相当するモード
		autoCenter: Phaser.Scale.CENTER_BOTH, // ゲームを画面の中央に配置
	},
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
			debug: isDebug,
		},
	},
	backgroundColor: "#eee",
};

const game = new Phaser.Game(config);
