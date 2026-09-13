export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.targetModaks = data.target || 7;
    this.wasWon = data.victory || false;
    this.level = data.level || 1;
  }

  create() {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    this.cameras.main.setBackgroundColor('#0d0705');

    const primaryColor = this.wasWon ? '#06d6a0' : '#ff4d4d';
    const accentColor = '#ffb703';

    // Outer framing card
    const card = this.add.rectangle(cx, cy, 640, 420, 0x180c07);
    card.setStrokeStyle(2, 0xd4a373);

    // Header Title
    this.add.text(cx, cy - 140, this.wasWon ? 'DIVINE OFFERING COMPLETE!' : 'CAUGHT BY GUARDS!', {
      fontSize: '34px',
      fontStyle: 'bold',
      color: primaryColor,
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    // Subtext
    this.add.text(cx, cy - 80, this.wasWon ? '॥ गणपती बाप्पा मोरया ॥' : 'Mooshak was spotted before reaching the altar!', {
      fontSize: '20px',
      color: '#ffd166',
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    // Score Board Panel
    this.add.rectangle(cx, cy + 10, 420, 90, 0x2e1205)
      .setStrokeStyle(1, 0xffa500);

    this.add.text(cx, cy - 12, `Level ${this.level} Modaks Gathered`, {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    this.add.text(cx, cy + 26, `${this.finalScore} / ${this.targetModaks}`, {
      fontSize: '32px',
      fontStyle: 'bold',
      color: accentColor,
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    // Restart prompt
    const prompt = this.add.text(cx, cy + 130, 'Press ENTER or Click Anywhere to Retry', {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    // Subtle pulsing animation on prompt text
    this.tweens.add({
      targets: prompt,
      alpha: 0.3,
      duration: 700,
      yoyo: true,
      repeat: -1
    });

    this.input.once('pointerdown', () => this.scene.start('GameScene', { level: 1 }));
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('GameScene', { level: 1 }));
  }
}