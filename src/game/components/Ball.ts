import Phaser from "phaser";

const BALL_BOUNDS = 1;

export default class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "ball");
    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setOrigin(0.5).setCollideWorldBounds(true, BALL_BOUNDS, BALL_BOUNDS, true).setBounce(BALL_BOUNDS);

    this.anims.create({
      key: "wobble",
      frames: this.anims.generateFrameNumbers("wobble", {
        frames: [0, 1, 0, 2, 0, 1, 0, 2, 0],
      }),
      frameRate: 24,
    });
  }

  public fire = (paddle: Phaser.Physics.Arcade.Sprite) => {
    this.setVelocity(-75, -300);
  };

  public wobble = () => {
    this.anims.play("wobble");
  };
}
