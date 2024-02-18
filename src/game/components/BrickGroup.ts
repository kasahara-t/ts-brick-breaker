import Brick from "./Brick";

export default class BrickGroup extends Phaser.Physics.Arcade.Group {
  static BRICK_COUNT = {
    ROW: 4,
    COLUMN: 7,
  };
  static BRICK_PADDING = 10;
  static BRICK_OFFSET = {
    TOP: 50,
    LEFT: 60,
  };

  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this.createBricks();
  }

  public countActiveBricks(): number {
    return this.children.entries.filter((brick) => (brick as Brick).isBroken === false).length;
  }

  private createBricks(): void {
    for (let y = 0; y < BrickGroup.BRICK_COUNT.ROW; y++) {
      for (let x = 0; x < BrickGroup.BRICK_COUNT.COLUMN; x++) {
        const brickX = x * (Brick.BRICK_WIDTH + BrickGroup.BRICK_PADDING) + BrickGroup.BRICK_OFFSET.LEFT;
        const brickY = y * (Brick.BRICK_HEIGHT + BrickGroup.BRICK_PADDING) + BrickGroup.BRICK_OFFSET.TOP;
        new Brick(this, brickX, brickY);
      }
    }
  }
}
