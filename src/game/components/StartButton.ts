export default class StartButton extends Phaser.GameObjects.Image {
  static BUTTON_TEXTURE = "button";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, StartButton.BUTTON_TEXTURE, 0);
    scene.add.existing(this);
    this.setInteractive();

    this.addListener("pointerout", this.pointerOut);
    this.addListener("pointerover", this.pointerOver);
    this.addListener("pointerdown", this.pointerDown);
  }

  private pointerOver(): void {
    this.setFrame(1);
  }

  private pointerOut(): void {
    this.setFrame(0);
  }

  private pointerDown(): void {
    this.setFrame(2);
  }
}
