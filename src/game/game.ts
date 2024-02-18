import Example from "@scenes/Example";

const isDebug = import.meta.env.MODE === "development";

const config: Phaser.Types.Core.GameConfig = {
  width: 480,
  height: 320,
  type: Phaser.AUTO,
  scene: [Example],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
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

export default class Game extends Phaser.Game {
  constructor() {
    super(config);
  }
}
