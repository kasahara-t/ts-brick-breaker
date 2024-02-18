export default class StartButton extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "button", 0);
    scene.add.existing(this);
    this.setInteractive();

    this.on("pointerout", this.pointerOut);
    this.on("pointerover", this.pointerOver);
    this.on("pointerdown", this.pointerDown);
  }

  private pointerOver = () => {
    this.setFrame(1);
  };

  private pointerOut = () => {
    this.setFrame(0);
  };

  private pointerDown = () => {
    this.setFrame(2);
  };
}
