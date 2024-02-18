import Ball from "@components/Ball";
import Brick from "@components/Brick";
import BrickGroup from "@components/BrickGroup";
import Paddle from "@components/Paddle";
import StartButton from "@components/StartButton";
import { getAssetUrl } from "../utils/helpers";

const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
  font: "18px Arial",
  color: "#0095DD",
};

export default class Example extends Phaser.Scene {
  private ball?: Ball;
  private paddle?: Paddle;
  private bricks?: BrickGroup;
  private score = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private life = 3;
  private lifeText?: Phaser.GameObjects.Text;
  private lifeLostText?: Phaser.GameObjects.Text;
  private isPlaying = false;
  private startButton?: StartButton;

  constructor() {
    super("Example");
  }

  public preload = () => {
    this.load.image("ball", getAssetUrl("images/ball.png"));
    this.load.spritesheet("wobble", getAssetUrl("images/wobble.png"), {
      frameWidth: 20,
      frameHeight: 20,
    });
    this.load.image("paddle", getAssetUrl("images/paddle.png"));
    this.load.image("brick", getAssetUrl("images/brick.png"));
    this.load.spritesheet("button", getAssetUrl("images/button.png"), {
      frameWidth: 120,
      frameHeight: 40,
    });
  };

  public create = () => {
    this.createBall();
    this.createPaddle();
    this.createBricks();
    this.createScoreText();
    this.createLifeText();
    this.createStartButton();
  };

  public update = () => {
    this.updatePaddlePosition();
    this.handleBallPaddleCollision();
    this.handleBrickBallCollision();
  };

  private createBall = () => {
    const { width, height } = this.scale;
    this.ball = new Ball(this, width * 0.5, height - 25);

    this.physics.world.addListener("worldbounds", this.handleOutOfBounds, this);
  };

  private createPaddle(): void {
    this.paddle = new Paddle(this, this.scale.width * 0.5, this.scale.height - 5);
  }

  private createBricks(): void {
    this.bricks = new BrickGroup(this);
  }

  private createScoreText(): void {
    this.scoreText = this.add.text(5, 5, "Points: 0", textStyle);
  }

  private createLifeText(): void {
    this.lifeText = this.add.text(this.scale.width - 5, 5, `Lives: ${this.life}`, textStyle).setOrigin(1, 0);
    this.lifeLostText = this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.5, "Life lost, click to continue", textStyle)
      .setOrigin(0.5)
      .setVisible(false);
  }

  private createStartButton(): void {
    this.startButton = new StartButton(this, this.scale.width * 0.5, this.scale.height * 0.5);

    this.startButton.on("pointerdown", this.startGame, this);
  }

  private updatePaddlePosition(): void {
    if (!this.isPlaying) return;

    this.paddle?.followPointer();
  }

  private handleBallPaddleCollision(): void {
    if (!this.ball || !this.paddle) return;

    const ballHitPaddle: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (ball, paddle) => {
      if (!(ball instanceof Ball) || !(paddle instanceof Paddle)) return;
      ball.wobble();
      ball.body?.velocity.set(-5 * (paddle.x - ball.x), ball.body.velocity.y);
    };

    this.physics.collide(this.ball, this.paddle, ballHitPaddle);
  }

  private handleBrickBallCollision(): void {
    if (!this.ball || !this.bricks) return;

    const ballHitBrick: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (ball, brick) => {
      if (!(brick instanceof Brick) || !(this.bricks instanceof BrickGroup) || !(ball instanceof Ball)) return;

      brick.break();

      this.score += 10;
      this.scoreText?.setText(`Points: ${this.score}`);

      if (this.bricks.countActiveBricks() === 0) {
        this.gameWon();
      }

      ball.wobble();
    };

    this.physics.collide(this.ball, this.bricks, ballHitBrick);
  }

  private handleOutOfBounds(body: Phaser.Physics.Arcade.Body, up: boolean, down: boolean): void {
    if (!down) {
      this.ball?.wobble();
      return;
    }
    if (!this.lifeText || !this.lifeLostText) return;

    if (--this.life === 0) {
      this.gameOver();
    }

    this.lifeText.setText(`Lives: ${this.life}`);
    this.lifeLostText.setVisible(true);

    const { width, height } = this.scale;
    this.ball?.setPosition(width * 0.5, height - 25).setVelocity(0, 0);
    this.paddle?.setPosition(width * 0.5, height - 5);

    this.input.on("pointerdown", this.continueGame, this);

    this.isPlaying = false;
  }

  private startGame(): void {
    this.isPlaying = true;
    this.startButton?.destroy();
    this.ball?.setVelocity(150, -150);
  }

  private continueGame(): void {
    this.isPlaying = true;
    this.lifeLostText?.setVisible(false);
    this.ball?.setVelocity(150, -150);
  }

  private gameWon(): void {
    alert("You won the game, congratulations!");
    location.reload();
  }

  private gameOver(): void {
    alert("Game Over");
    location.reload();
  }

  // シーンのシャットダウン時にイベントリスナーをクリーンアップ
  public shutdown(): void {
    this.physics.world.removeListener("worldbounds", this.handleOutOfBounds, this);
  }
}
