import Phaser from "phaser";

export default class Ball extends Phaser.Physics.Arcade.Sprite {
  static BALL_BOUNDS = 1;
  static BALL_SPEED = 300;
  static BALL_TEXTURE = "ball";
  static WOBBLE_TEXTURE = "wobble";
  static WOBBLE_KEY = "wobble";

  private initialX = 0;
  private initialY = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Ball.BALL_TEXTURE);
    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.initialX = x;
    this.initialY = y;

    this.setOrigin(0.5)
      .setCollideWorldBounds(true, Ball.BALL_BOUNDS, Ball.BALL_BOUNDS, true)
      .setBounce(Ball.BALL_BOUNDS);

    this.anims.create({
      key: Ball.WOBBLE_KEY,
      frames: this.anims.generateFrameNumbers(Ball.WOBBLE_TEXTURE, {
        frames: [0, 1, 0, 2, 0, 1, 0, 2, 0],
      }),
      frameRate: 24,
    });
  }

  public fire(angle: number): void {
    const vx = Ball.BALL_SPEED * Math.cos(angle);
    const vy = Ball.BALL_SPEED * Math.sin(angle);

    this.setVelocity(vx, vy);
  }

  public wobble(): void {
    this.anims.play(Ball.WOBBLE_KEY, true);
  }

  public reset(): void {
    this.setPosition(this.initialX, this.initialY);
    this.setVelocity(0, 0);
  }
}
