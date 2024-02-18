import Ball from "@components/Ball";
import Brick from "@components/Brick";
import BrickGroup from "@components/BrickGroup";
import Paddle from "@components/Paddle";
import StartButton from "@components/StartButton";
import LifeManager from "@managers/LifeManager";
import ScoreManager from "@managers/ScoreManager";
import { getAssetUrl } from "../utils/helpers";

const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
  font: "18px Arial",
  color: "#0095DD",
};

export default class MainScene extends Phaser.Scene {
  private ball?: Ball;
  private paddle?: Paddle;
  private bricks?: BrickGroup;
  private startButton?: StartButton;
  private scoreManager?: ScoreManager;
  private lifeManager?: LifeManager;
  private lifeLostText?: Phaser.GameObjects.Text;
  private isPlaying = false;

  constructor() {
    super("MainScene");
  }

  public preload(): void {
    this.load.image(Ball.BALL_TEXTURE, getAssetUrl("images/ball.png"));
    this.load.spritesheet(Ball.WOBBLE_TEXTURE, getAssetUrl("images/wobble.png"), {
      frameWidth: 20,
      frameHeight: 20,
    });
    this.load.image(Paddle.PADDLE_TEXTURE, getAssetUrl("images/paddle.png"));
    this.load.image(Brick.BRICK_TEXTURE, getAssetUrl("images/brick.png"));
    this.load.spritesheet(StartButton.BUTTON_TEXTURE, getAssetUrl("images/button.png"), {
      frameWidth: 120,
      frameHeight: 40,
    });
  }

  public create(): void {
    this.createBall();
    this.createPaddle();
    this.createBricks();
    this.createScoreText();
    this.createLifeText();
    this.createStartButton();
  }

  public update(): void {
    this.updatePaddlePosition();
    this.checkBallPaddleCollision();
    this.checkBallBrickCollision();
  }

  private createBall(): void {
    this.ball = new Ball(this, this.scale.width * 0.5, this.scale.height - 25);
    this.physics.world.addListener("worldbounds", this.handleOutOfBounds, this);
  }

  private createPaddle(): void {
    this.paddle = new Paddle(this, this.scale.width * 0.5, this.scale.height - 5);
  }

  private createBricks(): void {
    this.bricks = new BrickGroup(this);
  }

  private createScoreText(): void {
    this.scoreManager = new ScoreManager(this, 5, 5, textStyle);
  }

  private createLifeText(): void {
    this.lifeManager = new LifeManager(this, this.scale.width - 5, 5, textStyle);
    this.lifeLostText = this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.5, "Life lost, click to continue", textStyle)
      .setOrigin(0.5)
      .setVisible(false);
  }

  private createStartButton(): void {
    this.startButton = new StartButton(this, this.scale.width * 0.5, this.scale.height * 0.5);

    this.startButton.addListener("pointerdown", this.startGame, this);
  }

  private updatePaddlePosition(): void {
    if (!this.isPlaying) return;

    this.paddle?.followPointer();
  }

  private checkBallPaddleCollision(): void {
    if (!this.isPlaying) return;
    if (!this.ball || !this.paddle) return;

    this.physics.collide(this.ball, this.paddle, this.handleBallHitPaddle, undefined, this);
  }

  private checkBallBrickCollision(): void {
    if (!this.isPlaying) return;
    if (!this.ball || !this.bricks) return;

    this.physics.collide(this.ball, this.bricks, this.handleBallHitBrick, undefined, this);
  }

  private handleBallHitPaddle(
    ball: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    paddle: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
  ): void {
    if (!(ball instanceof Ball) || !(paddle instanceof Paddle)) return;

    ball.wobble();
    const diff = (ball.x - paddle.x) / (paddle.width / 2);

    const newAngle = (diff * Math.PI) / 4 - Math.PI / 2;
    ball.fire(newAngle);
  }

  private handleBallHitBrick(
    ball: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    brick: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
  ): void {
    if (!(brick instanceof Brick) || !(ball instanceof Ball)) return;

    ball.wobble();

    this.scoreManager?.addScore(10);

    brick.break();
    if (this.bricks?.countActiveBricks() === 0) {
      this.gameWon();
    }
  }

  private handleOutOfBounds(body: Phaser.Physics.Arcade.Body, up: boolean, down: boolean): void {
    if (!down) {
      this.ball?.wobble();
      return;
    }

    this.isPlaying = false;

    this.lifeManager?.loseLife();
    if (this.lifeManager?.isGameOver()) {
      this.gameOver();
    }

    this.ball?.reset();
    this.paddle?.reset();

    this.lifeLostText?.setVisible(true);
    this.input.on("pointerdown", this.continueGame, this);
  }

  private startGame(): void {
    this.isPlaying = true;
    this.startButton?.destroy();
    this.ball?.fire(-Math.PI * 0.5);
  }

  private continueGame(): void {
    this.isPlaying = true;
    this.lifeLostText?.setVisible(false);
    this.ball?.fire(-Math.PI * 0.5);
  }

  private gameWon(): void {
    alert("You won the game, congratulations!");
    location.reload();
  }

  private gameOver(): void {
    alert("Game Over");
    location.reload();
  }
}
