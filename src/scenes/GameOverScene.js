export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.victory = data.victory || false;
    this.score = data.score || 0;
    this.target = data.target || 0;
    this.level = data.level || 1;

    // Save & retrieve high score from browser localStorage
    const savedBest = parseInt(localStorage.getItem('modak_heist_best_score') || '0', 10);
    if (this.score > savedBest) {
      localStorage.setItem('modak_heist_best_score', this.score.toString());
      this.bestScore = this.score;
      this.isNewRecord = true;
    } else {
      this.bestScore = savedBest;
      this.isNewRecord = false;
    }
  }

  create() {
    const { width, height } = this.scale;

    // Dark backdrop
    this.add.rectangle(width / 2, height / 2, width, height, 0x0d0603, 0.92);

    // Ornate Result Card
    const card = this.add.rectangle(width / 2, height / 2, 460, 320, 0x1f0d07);
    card.setStrokeStyle(3, 0xd4a373);

    // Title / Status
    const titleText = this.victory ? '॥ महा प्रसादम् ॥' : 'CAUGHT BY GUARDS!';
    const titleColor = this.victory ? '#ffd166' : '#ef4444';

    this.add.text(width / 2, height / 2 - 110, titleText, {
      fontSize: '26px',
      fontStyle: 'bold',
      color: titleColor,
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    const subText = this.victory
      ? 'All sacred offerings delivered to Ganesha!'
      : 'Mooshak was spotted before completing the seva.';

    this.add.text(width / 2, height / 2 - 75, subText, {
      fontSize: '13px',
      color: '#d4a373',
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    // Score Details Box
    const scoreBox = this.add.rectangle(width / 2, height / 2, 380, 80, 0x140704);
    scoreBox.setStrokeStyle(1, 0xb07d4f);

    this.add.text(width / 2 - 90, height / 2 - 18, `Level Reached: ${this.level}`, {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Verdana'
    }).setOrigin(0, 0.5);

    this.add.text(width / 2 - 90, height / 2 + 12, `Modaks Secured: ${this.score}`, {
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#ffb703',
      fontFamily: 'Verdana'
    }).setOrigin(0, 0.5);

    // Personal Best badge
    const recordLabel = this.isNewRecord ? `★ NEW BEST: ${this.bestScore} ★` : `Personal Best: ${this.bestScore}`;
    this.add.text(width / 2, height / 2 + 65, recordLabel, {
      fontSize: '14px',
      fontStyle: 'bold',
      color: this.isNewRecord ? '#06d6a0' : '#d4a373',
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    // Play Again Button
    const btn = this.add.rectangle(width / 2, height / 2 + 115, 200, 42, 0xd97706)
      .setInteractive({ useHandCursor: true });
    btn.setStrokeStyle(2, 0xffd166);

    const btnText = this.add.text(width / 2, height / 2 + 115, 'PLAY AGAIN ⟳', {
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#1a0903',
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    btn.on('pointerover', () => btn.setFillStyle(0xf59e0b));
    btn.on('pointerout', () => btn.setFillStyle(0xd97706));
    btn.on('pointerdown', () => {
      this.scene.start('GameScene', { level: 1 });
    });

    // Keyboard restart shortcut (Space / Enter)
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene', { level: 1 });
    });
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('GameScene', { level: 1 });
    });
  }
}