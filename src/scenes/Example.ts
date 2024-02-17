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
	private isPlaying = false;
	private startButton?: Phaser.GameObjects.Image;

	constructor() {
		super("Example");
	}

	public preload(): void {
		this.load.image(
			"ball",
			new URL("../assets/ball.png", import.meta.url).href,
		);
		this.load.spritesheet(
			"wobble",
			new URL("../assets/wobble.png", import.meta.url).href,
			{ frameWidth: 20, frameHeight: 20 },
		);
		this.load.image(
			"paddle",
			new URL("../assets/paddle.png", import.meta.url).href,
		);
		this.load.image(
			"brick",
			new URL("../assets/brick.png", import.meta.url).href,
		);
		this.load.spritesheet(
			"button",
			new URL("../assets/button.png", import.meta.url).href,
			{
				frameWidth: 120,
				frameHeight: 40,
			},
		);
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
		this.handleBallPaddleCollision();
		this.handleBrickBallCollision();
	}

	private createBall(): void {
		const { width, height } = this.scale;
		this.ball = this.physics.add
			.sprite(width * 0.5, height - 25, "ball")
			.setOrigin(0.5)
			.setCollideWorldBounds(true, 1, 1, true)
			.setBounce(1);

		this.ball.anims.create({
			key: "wobble",
			frames: this.anims.generateFrameNumbers("wobble", {
				frames: [0, 1, 0, 2, 0, 1, 0, 2, 0],
			}),
			frameRate: 36,
		});

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

	private createStartButton(): void {
		this.startButton = this.add
			.image(this.scale.width * 0.5, this.scale.height * 0.5, "button", 0)
			.setInteractive();

		this.startButton.on(
			"pointerout",
			() => {
				this.startButton?.setFrame(0);
			},
			this,
		);
		this.startButton.on(
			"pointerover",
			() => {
				this.startButton?.setFrame(1);
			},
			this,
		);
		this.startButton.on(
			"pointerdown",
			() => {
				this.startButton?.setFrame(2);
				this.startGame();
			},
			this,
		);
	}

	private updatePaddlePosition(): void {
		if (!this.paddle) return;
		if (!this.isPlaying) return;

		this.paddle.setX(this.input.x);
	}

	private handleBallPaddleCollision(): void {
		if (!this.ball || !this.paddle || !this.bricks) return;

		const ballHitPaddle: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
			ball,
			paddle,
		) => {
			if (
				!(ball instanceof Phaser.Physics.Arcade.Sprite) ||
				!(paddle instanceof Phaser.Physics.Arcade.Sprite)
			)
				return;

			ball.anims.play("wobble");
			ball.body?.velocity.set(-5 * (paddle.x - ball.x), ball.body.velocity.y);
		};

		this.physics.collide(this.ball, this.paddle, ballHitPaddle);
	}

	private handleBrickBallCollision(): void {
		if (!this.ball || !this.paddle || !this.bricks) return;

		const ballHitBrick: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
			ball,
			brick,
		) => {
			this.tweens
				.add({
					targets: brick,
					scaleX: 0,
					scaleY: 0,
					duration: 200,
					ease: "Linear",
					onComplete: () => {
						brick.destroy();
					},
				} as Phaser.Types.Tweens.TweenBuilderConfig)
				.play();

			this.score += 10;
			this.scoreText?.setText(`Points: ${this.score}`);

			if (this.score === brickInfo.count.row * brickInfo.count.col * 10) {
				alert("You won the game, congratulations!");
				location.reload();
			}

			(ball as Phaser.Physics.Arcade.Sprite).anims.play("wobble");
		};

		this.physics.collide(this.ball, this.bricks, ballHitBrick);
	}

	private handleOutOfBounds(
		body: Phaser.Physics.Arcade.Body,
		up: boolean,
		down: boolean,
	): void {
		if (!this.ball || !this.paddle) return;
		if (!down) {
			this.ball.anims.play("wobble");
			return;
		}
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

		this.input.on(
			"pointerdown",
			() => {
				this.isPlaying = true;
				this.lifeLostText?.setVisible(false);
				this.ball?.setVelocity(150, -150);
			},
			this,
		);

		this.isPlaying = false;
	}

	private startGame(): void {
		if (!this.ball) return;

		this.isPlaying = true;
		this.startButton?.destroy();
		this.ball.setVelocity(150, -150);
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
