export default class Paddle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "paddle");
    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setOrigin(0.5, 1).setCollideWorldBounds(true).setImmovable(true);
  }

  public followPointer = () => {
    const halfWidth = this.displayWidth * 0.5;
    const leftBound = halfWidth;
    const rightBound = this.scene.scale.width - halfWidth;
    const paddleX = Phaser.Math.Clamp(this.scene.input.activePointer.x, leftBound, rightBound);

    this.x = paddleX;
  };
}
