export default class ScoreManager {
  private score = 0;
  private scoreText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, textX: number, textY: number, textStyle: Phaser.Types.GameObjects.Text.TextStyle) {
    this.scoreText = scene.add.text(textX, textY, this.generateScoreText(), textStyle);
  }

  addScore(points: number) {
    this.score += points;
    this.updateScoreText();
  }

  private updateScoreText() {
    this.scoreText.setText(this.generateScoreText());
  }

  private generateScoreText(): string {
    return `Points: ${this.score}`;
  }
}
