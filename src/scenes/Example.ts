import "phaser";

export default class Example extends Phaser.Scene {
	private ball?: Phaser.Physics.Arcade.Sprite;
	private paddle?: Phaser.Physics.Arcade.Sprite;

	constructor() {
		super("Example");
	}

	preload(): void {
		this.load.image(
			"ball",
			new URL("../assets/ball.png", import.meta.url).href,
		);
		this.load.image(
			"paddle",
			new URL("../assets/paddle.png", import.meta.url).href,
		);
	}

	create(): void {
		this.createBall();
		this.createPaddle();
	}

	update(): void {
		this.updatePaddlePosition();
		this.handleBallPaddleCollision();
	}

	private createBall(): void {
		const { width, height } = this.scale;
		this.ball = this.physics.add
			.sprite(width * 0.5, height - 25, "ball")
			.setOrigin(0.5)
			.setCollideWorldBounds(true, 1, 1, true)
			.setBounce(1, 1)
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

	private updatePaddlePosition(): void {
		if (this.paddle) {
			this.paddle.setX(this.input.x);
		}
	}

	private handleBallPaddleCollision(): void {
		if (this.ball && this.paddle) {
			this.physics.collide(this.ball, this.paddle);
		}
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
