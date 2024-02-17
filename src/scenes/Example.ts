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

export default class Example extends Phaser.Scene {
	private ball?: Phaser.Physics.Arcade.Sprite;
	private paddle?: Phaser.Physics.Arcade.Sprite;
	private bricks?: Phaser.Physics.Arcade.Group;

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

		this.physics.world.addListener("worldbounds", this.handleOutOfBounds);
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

	private updatePaddlePosition(): void {
		if (!this.paddle) return;
		this.paddle.setX(this.input.x);
	}

	private handleBallPaddleCollision(): void {
		if (!this.ball || !this.paddle || !this.bricks) return;
		this.physics.collide(this.ball, this.paddle);
	}

	private handleBrickBallCollision(): void {
		if (!this.ball || !this.paddle || !this.bricks) return;
		this.physics.collide(this.ball, this.bricks, (_, brick) => {
			brick.destroy(true);
		});
	}

	private handleOutOfBounds(
		body: Phaser.Physics.Arcade.Body,
		up: boolean,
		down: boolean,
	): void {
		if (down) {
			alert("Game Over");
			location.reload();
		}
	}

	// シーンのシャットダウン時にイベントリスナーをクリーンアップ
	public shutdown(): void {
		this.physics.world.removeListener("worldbounds", this.handleOutOfBounds);
	}
}
