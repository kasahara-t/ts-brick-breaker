import BrickGroup from "./BrickGroup";

export const BRICK_WIDTH = 50;
export const BRICK_HEIGHT = 20;

export default class Brick extends Phaser.Physics.Arcade.Sprite {
  public isBroken = false;

  constructor(group: BrickGroup, x: number, y: number) {
    super(group.scene, x, y, "brick");
    group.scene.add.existing(this);
    group.add(this);
    this.scene.physics.world.enable(this);

    this.setOrigin(0.5).setImmovable(true);
  }

  public break = () => {
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
  };
}
