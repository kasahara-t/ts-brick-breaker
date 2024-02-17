import "phaser";

const brickInfo = {
	width: 50,
	height: 20,
	count: {
		row: 3,
		col: 7,
	},
	offset: {
		top: 50,
		left: 60,
	},
	padding: 10,
};

const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
	font: "18px Arial",
	color: "#0095DD",
};

export default class Example extends Phaser.Scene {
	private ball?: Phaser.Physics.Arcade.Sprite;
	private paddle?: Phaser.Physics.Arcade.Sprite;
	private bricks?: Phaser.Physics.Arcade.Group;
	private score = 0;
	private scoreText?: Phaser.GameObjects.Text;
	private life = 3;
	private lifeText?: Phaser.GameObjects.Text;
	private lifeLostText?: Phaser.GameObjects.Text;

	constructor() {
		super("Example");
	}

	public preload(): void {
		this.load.image(
			"ball",
			new URL("../assets/ball.png", import.meta.url).href,
		);
		this.load.image(
			"paddle",
			new URL("../assets/paddle.png", import.meta.url).href,
		);
		this.load.image(
			"brick",
			new URL("../assets/brick.png", import.meta.url).href,
		);
	}

	public create(): void {
		this.createBall();
		this.createPaddle();
		this.createBricks();
		this.createScoreText();
		this.createLifeText();
	}

	public update(): void {
		this.updatePaddlePosition();
		this.handleBallPaddleCollision();
		this.handleBrickBallCollision();
	}

	private createBall(): void {
		const { width, height } = this.scale;
		this.ball = this.physics.add
			.sprite(width * 0.5, height - 25, "ball")
			.setOrigin(0.5)
			.setCollideWorldBounds(true, 1, 1, true)
			.setBounce(1)
			.setVelocity(150, -150);

		this.physics.world.addListener("worldbounds", this.handleOutOfBounds, this);
	}

	private createPaddle(): void {
		const { width, height } = this.scale;
		this.paddle = this.physics.add
			.sprite(width * 0.5, height - 5, "paddle")
			.setOrigin(0.5, 1)
			.setImmovable(true);
	}

	private createBricks(): void {
		this.bricks = this.physics.add.group();
		for (let i = 0; i < brickInfo.count.row; i++) {
			for (let j = 0; j < brickInfo.count.col; j++) {
				const brickX =
					j * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left;
				const brickY =
					i * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top;
				this.bricks
					.create(brickX, brickY, "brick")
					.setImmovable(true)
					.setOrigin(0.5);
			}
		}
	}

	private createScoreText(): void {
		this.scoreText = this.add.text(5, 5, "Points: 0", textStyle);
	}

	private createLifeText(): void {
		this.lifeText = this.add
			.text(this.scale.width - 5, 5, `Lives: ${this.life}`, textStyle)
			.setOrigin(1, 0);
		this.lifeLostText = this.add
			.text(
				this.scale.width * 0.5,
				this.scale.height * 0.5,
				"Life lost, click to continue",
				textStyle,
			)
			.setOrigin(0.5)
			.setVisible(false);
	}

	private updatePaddlePosition(): void {
		if (!this.paddle) return;
		if (this.lifeLostText?.visible) return;

		this.paddle.setX(this.input.x);
	}

	private handleBallPaddleCollision(): void {
		if (!this.ball || !this.paddle || !this.bricks) return;

		this.physics.collide(this.ball, this.paddle);
	}

	private handleBrickBallCollision(): void {
		if (!this.ball || !this.paddle || !this.bricks) return;

		const ballHitBrick: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
			ball,
			brick,
		) => {
			brick.destroy(true);
			this.score += 10;
			this.scoreText?.setText(`Points: ${this.score}`);

			if (this.bricks?.countActive() === 0) {
				alert("You won the game, congratulations!");
				location.reload();
			}
		};

		this.physics.collide(this.ball, this.bricks, ballHitBrick);
	}

	private handleOutOfBounds(
		body: Phaser.Physics.Arcade.Body,
		up: boolean,
		down: boolean,
	): void {
		if (!down) return;
		if (!this.ball || !this.paddle) return;
		if (!this.lifeText || !this.lifeLostText) return;

		if (--this.life === 0) {
			alert("Game Over");
			location.reload();
		}

		this.lifeText.setText(`Lives: ${this.life}`);
		this.lifeLostText.setVisible(true);

		const { width, height } = this.scale;
		this.ball.setPosition(width * 0.5, height - 25).setVelocity(0, 0);
		this.paddle.setPosition(width * 0.5, height - 5);

		this.input.on("pointerdown", () => {
			this.lifeLostText?.setVisible(false);
			this.ball?.setVelocity(150, -150);
		});
	}

	// シーンのシャットダウン時にイベントリスナーをクリーンアップ
	public shutdown(): void {
		this.physics.world.removeListener(
			"worldbounds",
			this.handleOutOfBounds,
			this,
		);
	}
}
