export default class LifeManager {
  private life = 3;
  private lifeText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, textX: number, textY: number, textStyle: Phaser.Types.GameObjects.Text.TextStyle) {
    this.lifeText = scene.add.text(textX, textY, this.generateLifeText(), textStyle).setOrigin(1, 0);
  }

  public isGameOver(): boolean {
    return this.life <= 0;
  }

  public loseLife() {
    this.life -= 1;
    this.updateLifeText();
  }

  private updateLifeText() {
    this.lifeText.setText(this.generateLifeText());
  }

  private generateLifeText(): string {
    return `Life: ${this.life}`;
  }
}
