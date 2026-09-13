export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.levelsCleared = data.levelsCleared || 0;
    this.totalModaks = data.totalModaks || 0;

    // Tie-breaker formula: levelsCleared dominates, modaks break ties
    const runRankValue = (this.levelsCleared * 10000) + this.totalModaks;

    const savedBestCleared = parseInt(localStorage.getItem('modak_best_cleared') || '0', 10);
    const savedBestModaks = parseInt(localStorage.getItem('modak_best_modaks') || '0', 10);
    const savedBestRank = (savedBestCleared * 10000) + savedBestModaks;

    if (runRankValue > savedBestRank) {
      localStorage.setItem('modak_best_cleared', this.levelsCleared.toString());
      localStorage.setItem('modak_best_modaks', this.totalModaks.toString());
      this.bestCleared = this.levelsCleared;
      this.bestModaks = this.totalModaks;
      this.isNewRecord = true;
    } else {
      this.bestCleared = savedBestCleared;
      this.bestModaks = savedBestModaks;
      this.isNewRecord = false;
    }
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x0d0603, 0.92);

    const card = this.add.rectangle(width / 2, height / 2, 480, 330, 0x1f0d07);
    card.setStrokeStyle(3, 0xd4a373);

    this.add.text(width / 2, height / 2 - 115, 'CAUGHT BY GUARDS!', {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ef4444',
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 82, 'Mooshak was spotted before completing the seva.', {
      fontSize: '13px',
      color: '#d4a373',
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    // Score breakdown box
    const scoreBox = this.add.rectangle(width / 2, height / 2 - 5, 410, 86, 0x140704);
    scoreBox.setStrokeStyle(1, 0xb07d4f);

    this.add.text(width / 2 - 170, height / 2 - 25, `Levels Cleared:`, {
      fontSize: '15px',
      color: '#d4a373',
      fontFamily: 'Verdana'
    }).setOrigin(0, 0.5);

    this.add.text(width / 2 + 170, height / 2 - 25, `${this.levelsCleared}`, {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
      fontFamily: 'Verdana'
    }).setOrigin(1, 0.5);

    this.add.text(width / 2 - 170, height / 2 + 15, `Modaks Gathered (Points):`, {
      fontSize: '15px',
      color: '#d4a373',
      fontFamily: 'Verdana'
    }).setOrigin(0, 0.5);

    this.add.text(width / 2 + 170, height / 2 + 15, `${this.totalModaks} pts`, {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffb703',
      fontFamily: 'Verdana'
    }).setOrigin(1, 0.5);

    // Personal Best Banner with Tie-Breaker Display
    const recordLabel = this.isNewRecord
      ? `★ NEW RECORD: ${this.bestCleared} Levels Cleared (${this.bestModaks} pts) ★`
      : `Personal Best: ${this.bestCleared} Levels Cleared (${this.bestModaks} pts)`;

    this.add.text(width / 2, height / 2 + 65, recordLabel, {
      fontSize: '13px',
      fontStyle: 'bold',
      color: this.isNewRecord ? '#06d6a0' : '#ffd166',
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    // Restart button
    const btn = this.add.rectangle(width / 2, height / 2 + 115, 200, 40, 0xd97706)
      .setInteractive({ useHandCursor: true });
    btn.setStrokeStyle(2, 0xffd166);

    this.add.text(width / 2, height / 2 + 115, 'TRY AGAIN ⟳', {
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#1a0903',
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    const restart = () => this.scene.start('GameScene', { level: 1, levelsCleared: 0, totalModaks: 0 });
    btn.on('pointerdown', restart);
    this.input.keyboard.once('keydown-SPACE', restart);
    this.input.keyboard.once('keydown-ENTER', restart);
  }
}