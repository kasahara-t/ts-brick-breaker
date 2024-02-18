import BrickGroup from "./BrickGroup";

export default class Brick extends Phaser.Physics.Arcade.Sprite {
  static BRICK_WIDTH = 50;
  static BRICK_HEIGHT = 20;
  static BRICK_TEXTURE = "brick";

  public isBroken = false;

  constructor(group: BrickGroup, x: number, y: number) {
    super(group.scene, x, y, Brick.BRICK_TEXTURE);
    group.scene.add.existing(this);
    group.add(this);
    this.scene.physics.world.enable(this);

    this.setOrigin(0.5).setImmovable(true);
  }

  public break(): void {
    const tweenConfig: Phaser.Types.Tweens.TweenBuilderConfig = {
      targets: this,
      scaleX: 0,
      scaleY: 0,
      duration: 200,
      onComplete: () => {
        this.destroy();
      },
    };

    this.scene.tweens.add(tweenConfig).play();
    this.isBroken = true;
  }
}
