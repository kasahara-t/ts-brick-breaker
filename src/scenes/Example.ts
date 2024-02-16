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
	}

	private createBall(): void {
		const { width, height } = this.scale;
		this.ball = this.physics.add
			.sprite(width * 0.5, height - 25, "ball")
			.setCollideWorldBounds(true)
			.setBounce(1, 1)
			.setVelocity(150, -150);
	}

	private createPaddle(): void {
		const { width, height } = this.scale;
		this.paddle = this.physics.add
			.sprite(width * 0.5, height - 5, "paddle")
			.setImmovable(true);
		this.paddle.setOrigin(0.5, 1);
	}

	private updatePaddlePosition(): void {
		if (!this.ball || !this.paddle) return;

		const pointer = this.input.activePointer;
		if (!pointer.isDown) {
			// パドルをマウスカーソルまたはタッチ位置に追従させる
			this.paddle.x = pointer.x;
		}
	}
}
