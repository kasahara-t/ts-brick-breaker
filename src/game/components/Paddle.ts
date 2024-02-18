export default class Paddle extends Phaser.Physics.Arcade.Sprite {
  static PADDLE_TEXTURE = "paddle";

  private initialX = 0;
  private initialY = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Paddle.PADDLE_TEXTURE);
    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.initialX = x;
    this.initialY = y;

    this.setOrigin(0.5, 1).setCollideWorldBounds(true).setImmovable(true);
  }

  public followPointer(): void {
    const halfWidth = this.displayWidth * 0.5;
    const leftBound = halfWidth;
    const rightBound = this.scene.scale.width - halfWidth;
    const paddleX = Phaser.Math.Clamp(this.scene.input.activePointer.x, leftBound, rightBound);

    this.x = paddleX;
  }

  public reset(): void {
    this.setPosition(this.initialX, this.initialY);
  }
}
