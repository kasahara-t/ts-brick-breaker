import Brick, { BRICK_HEIGHT, BRICK_WIDTH } from "./Brick";

export const BRICK_COUNT = {
  ROW: 4,
  COLUMN: 7,
};
export const BRICK_PADDING = 10;
export const BRICK_OFFSET = {
  TOP: 50,
  LEFT: 60,
};

export default class BrickGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this.createBricks();
  }

  public countActiveBricks = () => {
    return this.children.entries.filter((brick) => (brick as Brick).isBroken === false).length;
  };

  private createBricks = () => {
    for (let y = 0; y < BRICK_COUNT.ROW; y++) {
      for (let x = 0; x < BRICK_COUNT.COLUMN; x++) {
        const brickX = x * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET.LEFT;
        const brickY = y * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET.TOP;
        const brick = new Brick(this, brickX, brickY);
      }
    }
  };
}
