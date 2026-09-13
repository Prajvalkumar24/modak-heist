import Player from '../entities/Player.js';
import Guard from '../entities/Guard.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.currentLevel = data.level || 1;
  }

  create() {
    const { width, height } = this.scale;

    this.targetModaks = Math.min(4 + this.currentLevel, 10);
    this.timeLeft = Math.max(70 - this.currentLevel * 4, 30);
    this.guardCount = Math.min(2 + Math.floor(this.currentLevel * 0.7), 5);
    this.score = 0;
    this.bellsLeft = 3;
    this.isGameOver = false;

    this.arena = {
      x: 20,
      y: 56,
      w: width - 40,
      h: height - 76
    };

    // 1. Tiled Courtyard Stone Floor
    this.add.tileSprite(
      this.arena.x + this.arena.w / 2,
      this.arena.y + this.arena.h / 2,
      this.arena.w,
      this.arena.h,
      'floor_tile'
    ).setDepth(0);

    // 2. Docked Ornate HUD
    this.createHeaderHUD(width);

    // 3. Aarti Countdown Timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.tickTimer,
      callbackScope: this,
      loop: true
    });

    // 4. Temple Walls & Pillars
    this.walls = this.physics.add.staticGroup();
    this.spawnStructuredMap();

    // 5. Lord Ganesha Sanctum & Lamps
    const altarX = this.arena.x + this.arena.w / 2;
    const altarY = this.arena.y + 64;
    this.altar = this.physics.add.sprite(altarX, altarY, 'altar_tex').setDepth(10);
    this.add.text(altarX, altarY - 44, '॥ श्री गणेशाय नमः ॥', {
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ffd166',
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    this.spawnSanctumLamps(altarX, altarY);

    // 6. Player (Mooshak)
    this.player = new Player(this, this.arena.x + 45, this.arena.y + this.arena.h - 45);
    this.physics.add.collider(this.player, this.walls);

    // 7. Guards
    this.guards = [];
    for (let i = 0; i < this.guardCount; i++) {
      const guard = new Guard(this, this.arena);
      guard.patrolSpeed += this.currentLevel * 4;
      this.physics.add.collider(guard, this.walls);
      this.guards.push(guard);
    }

    // 8. Modaks
    this.modaks = this.physics.add.group();
    this.spawnSafeModaks();

    // 9. Input & Mobile Controls
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.createMobileControls(width, height);

    // Overlaps
    this.physics.add.overlap(this.player, this.modaks, this.collectModak, null, this);
    this.physics.add.overlap(this.player, this.altar, this.reachAltar, null, this);
  }

  createHeaderHUD(width) {
    const header = this.add.rectangle(width / 2, 28, width, 56, 0x140a06);
    header.setStrokeStyle(2, 0xd4a373);
    header.setDepth(20);

    this.levelBadge = this.add.text(30, 26, `LVL ${this.currentLevel}`, {
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#ffb703',
      fontFamily: 'Verdana'
    }).setOrigin(0, 0.5).setDepth(21);

    this.scoreText = this.add.text(width * 0.35, 26, `Modaks: 0 / ${this.targetModaks}`, {
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#ffffff',
      fontFamily: 'Verdana'
    }).setOrigin(0.5).setDepth(21);

    this.bellText = this.add.text(width * 0.65, 26, `🔔 Bells: ${this.bellsLeft}`, {
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#ffd166',
      fontFamily: 'Verdana'
    }).setOrigin(0.5).setDepth(21);

    this.timerText = this.add.text(width - 30, 26, `Aarti: ${this.timeLeft}s`, {
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#06d6a0',
      fontFamily: 'Verdana'
    }).setOrigin(1, 0.5).setDepth(21);
  }

  createMobileControls(width, height) {
    const dpadY = height - 90;
    const dpadX = 90;

    const makeBtn = (x, y, label, callback) => {
      const circle = this.add.circle(x, y, 28, 0x3d1a08, 0.65).setStrokeStyle(2, 0xd4a373).setInteractive().setDepth(30);
      const text = this.add.text(x, y, label, { fontSize: '18px', fontStyle: 'bold', color: '#ffd166' }).setOrigin(0.5).setDepth(31);
      circle.on('pointerdown', callback);
      circle.on('pointerup', () => { this.player.touchVelocity = { x: 0, y: 0 }; });
      circle.on('pointerout', () => { this.player.touchVelocity = { x: 0, y: 0 }; });
    };

    makeBtn(dpadX, dpadY - 45, '▲', () => { this.player.touchVelocity = { x: 0, y: -1 }; });
    makeBtn(dpadX, dpadY + 45, '▼', () => { this.player.touchVelocity = { x: 0, y: 1 }; });
    makeBtn(dpadX - 45, dpadY, '◄', () => { this.player.touchVelocity = { x: -1, y: 0 }; });
    makeBtn(dpadX + 45, dpadY, '►', () => { this.player.touchVelocity = { x: 1, y: 0 }; });

    // Mobile Action Button for Bell Distraction
    const bellBtn = this.add.circle(width - 80, height - 80, 36, 0xb8860b, 0.8).setStrokeStyle(2, 0xffd166).setInteractive().setDepth(30);
    this.add.text(width - 80, height - 80, '🔔', { fontSize: '24px' }).setOrigin(0.5).setDepth(31);
    bellBtn.on('pointerdown', () => this.ringDistractionBell());
  }

  ringDistractionBell() {
    if (this.bellsLeft <= 0 || this.isGameOver) return;
    this.bellsLeft--;
    this.bellText.setText(`🔔 Bells: ${this.bellsLeft}`);

    if (window.SoundFX) window.SoundFX.bell();

    // Spawn expanding ripple effect at Mooshak's position
    const ripple = this.add.circle(this.player.x, this.player.y, 10, 0xffd166, 0.6).setDepth(14);
    this.tweens.add({
      targets: ripple,
      radius: 180,
      alpha: 0,
      duration: 700,
      onComplete: () => ripple.destroy()
    });

    // Alert nearby guards within 220px
    const distractionPoint = { x: this.player.x, y: this.player.y };
    this.guards.forEach(g => {
      const dist = Phaser.Math.Distance.Between(g.x, g.y, distractionPoint.x, distractionPoint.y);
      if (dist < 260) {
        g.distract(distractionPoint);
      }
    });
  }

  spawnSanctumLamps(altarX, altarY) {
    [-65, 65].forEach(offset => {
      const lx = altarX + offset;
      const ly = altarY;
      this.add.sprite(lx, ly, 'diya_tex').setDepth(9);
      const glow = this.add.circle(lx, ly - 4, 28, 0xffa500, 0.18).setDepth(3);
      this.tweens.add({
        targets: glow,
        alpha: 0.08,
        scale: 1.2,
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    });
  }

  spawnStructuredMap() {
    const a = this.arena;

    const borders = [
      { x: a.x + a.w / 2, y: a.y, w: a.w, h: 8 },
      { x: a.x + a.w / 2, y: a.y + a.h, w: a.w, h: 8 },
      { x: a.x, y: a.y + a.h / 2, w: 8, h: a.h },
      { x: a.x + a.w, y: a.y + a.h / 2, w: 8, h: a.h }
    ];

    borders.forEach(b => {
      const wall = this.add.rectangle(b.x, b.y, b.w, b.h, 0x3d1a08);
      wall.setStrokeStyle(2, 0xd4a373);
      this.physics.add.existing(wall, true);
      this.walls.add(wall);
    });

    const cx = a.x + a.w / 2;
    const cy = a.y + 64;
    const sanctumWalls = [
      { x: cx - 85, y: cy + 15, w: 10, h: 96 },
      { x: cx + 85, y: cy + 15, w: 10, h: 96 },
      { x: cx - 55, y: cy + 68, w: 50, h: 10 },
      { x: cx + 55, y: cy + 68, w: 50, h: 10 }
    ];

    sanctumWalls.forEach(b => {
      const wall = this.add.rectangle(b.x, b.y, b.w, b.h, 0x4a210d);
      wall.setStrokeStyle(2, 0xffb703);
      this.physics.add.existing(wall, true);
      this.walls.add(wall);
    });

    const sectors = [
      { minX: a.x + 80, maxX: a.x + 240, minY: a.y + 140, maxY: a.y + 260 },
      { minX: a.x + a.w - 240, maxX: a.x + a.w - 80, minY: a.y + 140, maxY: a.y + 260 },
      { minX: a.x + 80, maxX: a.x + 260, minY: a.y + 290, maxY: a.y + 420 },
      { minX: a.x + a.w - 260, maxX: a.x + a.w - 80, minY: a.y + 290, maxY: a.y + 420 },
      { minX: a.x + a.w / 2 - 120, maxX: a.x + a.w / 2 + 120, minY: a.y + 220, maxY: a.y + 360 }
    ];

    sectors.forEach(sec => {
      const px = Phaser.Math.Between(sec.minX, sec.maxX);
      const py = Phaser.Math.Between(sec.minY, sec.maxY);
      const isWide = Phaser.Math.Between(0, 1) === 1;
      const pw = isWide ? 80 : 34;
      const ph = isWide ? 34 : 80;

      const pillar = this.add.rectangle(px, py, pw, ph, 0x33180c);
      pillar.setStrokeStyle(2, 0xb07d4f);
      this.physics.add.existing(pillar, true);
      this.walls.add(pillar);
    });
  }

  spawnSafeModaks() {
    const a = this.arena;
    let placed = 0;
    let attempts = 0;
    const wallList = this.walls.getChildren();
    const placedPoints = [];

    while (placed < this.targetModaks && attempts < 400) {
      attempts++;
      const mx = Phaser.Math.Between(a.x + 60, a.x + a.w - 60);
      const my = Phaser.Math.Between(a.y + 140, a.y + a.h - 60);

      const tooClose = placedPoints.some(pt => Phaser.Math.Distance.Between(mx, my, pt.x, pt.y) < 70);
      if (tooClose) continue;

      const bounds = new Phaser.Geom.Rectangle(mx - 24, my - 24, 48, 48);
      let hitWall = false;
      for (const wall of wallList) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, wall.getBounds())) {
          hitWall = true;
          break;
        }
      }

      if (!hitWall) {
        const modak = this.physics.add.sprite(mx, my, 'modak_tex').setDepth(9);
        this.modaks.add(modak);
        placedPoints.push({ x: mx, y: my });
        placed++;
      }
    }
  }

  tickTimer() {
    if (this.isGameOver) return;
    this.timeLeft -= 1;
    this.timerText.setText(`Aarti: ${this.timeLeft}s`);
    if (this.timeLeft <= 10) this.timerText.setColor('#ff3333');
    if (this.timeLeft <= 0) this.handleDefeat('Aarti began before offerings reached Ganesha!');
  }

  collectModak(player, modak) {
    modak.destroy();
    if (window.SoundFX) window.SoundFX.bell();
    this.score += 1;
    this.scoreText.setText(`Modaks: ${this.score} / ${this.targetModaks}`);

    if (this.score >= this.targetModaks) {
      this.scoreText.setColor('#06d6a0');
      this.scoreText.setText('ALL MODAKS SECURED! OFFER TO GANESHA!');
    }
  }

  reachAltar() {
    if (this.score < this.targetModaks || this.isGameOver) return;
    this.isGameOver = true;
    this.timerEvent.remove();
    this.player.body.setVelocity(0);

    this.guards.forEach(g => {
      g.body.setVelocity(0);
      if (g.visionGraphics) g.visionGraphics.clear();
    });

    if (window.SoundFX) window.SoundFX.victory();

    const p = this.add.particles(this.altar.x, this.altar.y, 'petal_tex', {
      speed: { min: -180, max: 180 },
      scale: { start: 1.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 1600,
      quantity: 50
    });
    p.explode();

    this.time.delayedCall(1600, () => {
      this.scene.restart({ level: this.currentLevel + 1 });
    });
  }

  handleDefeat(msg) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.timerEvent.remove();
    this.player.body.setVelocity(0);

    this.guards.forEach(g => {
      g.body.setVelocity(0);
      if (g.visionGraphics) g.visionGraphics.clear();
    });

    if (window.SoundFX) window.SoundFX.alert();

    this.time.delayedCall(1200, () => {
      this.scene.start('GameOverScene', {
        victory: false,
        score: this.score,
        target: this.targetModaks,
        level: this.currentLevel
      });
    });
  }

  update() {
    if (this.isGameOver) return;

    // Spacebar triggers bell distraction
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.ringDistractionBell();
    }

    this.player.update();

    for (const g of this.guards) {
      g.update(this.player, this.walls.getChildren(), () => {
        this.handleDefeat('A Temple Guard captured Mooshak!');
      });
    }
  }
}