import Player from '../entities/Player.js';
import Guard from '../entities/Guard.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

 init(data) {
  this.currentLevel = data.level || 1;
  this.levelsCleared = data.levelsCleared || 0;
  this.totalModaks = data.totalModaks || 0;
}

  create() {
    const { width, height } = this.scale;

    this.targetModaks = Math.min(4 + this.currentLevel, 10);
    this.timeLeft = Math.max(70 - this.currentLevel * 4, 30);
    this.guardCount = Math.min(2 + Math.floor(this.currentLevel * 0.7), 5);
    this.score = 0;
    this.isGameOver = false;

    // Automatic Idle Bell Detection
    this.idleSeconds = 0;
    this.lastPlayerPos = { x: 0, y: 0 };

    this.arena = {
      x: 16,
      y: 50,
      w: width - 32,
      h: height - 66
    };

    // 1. Tiled Courtyard Floor
    this.add.tileSprite(
      this.arena.x + this.arena.w / 2,
      this.arena.y + this.arena.h / 2,
      this.arena.w,
      this.arena.h,
      'floor_tile'
    ).setDepth(0);

    // 2. Clean Top HUD (No Bell Ammo)
    this.createHeaderHUD(width);

    // 3. Game Timer & Idle Check Loop (1 second tick)
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.tickSecond,
      callbackScope: this,
      loop: true
    });

    // 4. Temple Walls & Pillars
    this.walls = this.physics.add.staticGroup();
    this.spawnStructuredMap();

    // 5. Lord Ganesha Sanctum & Diyas
    const altarX = this.arena.x + this.arena.w / 2;
    const altarY = this.arena.y + 60;
    this.altar = this.physics.add.sprite(altarX, altarY, 'altar_tex').setDepth(10);
    this.add.text(altarX, altarY - 42, '॥ श्री गणेशाय नमः ॥', {
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ffd166',
      fontFamily: 'Verdana'
    }).setOrigin(0.5);

    this.spawnSanctumLamps(altarX, altarY);

    // 6. Player (Mooshak)
    this.player = new Player(this, this.arena.x + 100, this.arena.y + this.arena.h - 50);
    this.lastPlayerPos = { x: this.player.x, y: this.player.y };
    this.physics.add.collider(this.player, this.walls);

    // Idle warning popup directly over Mooshak
    this.idleWarningText = this.add.text(this.player.x, this.player.y - 22, '', {
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#ffd166',
      fontFamily: 'Verdana',
      backgroundColor: '#1a0903',
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5).setDepth(30).setVisible(false);

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

    // 9. Controls: STRICT Mobile/Tablet Check (Never on Laptops)
   // 9. Mobile & Tablet Only Detection (Strict: never triggers on standard laptops/desktops)
    const isMobileDevice = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && window.matchMedia('(hover: none)').matches);

    if (isMobileDevice) {
      this.createMobileControls(width, height);
    }

    // Overlaps
    this.physics.add.overlap(this.player, this.modaks, this.collectModak, null, this);
    this.physics.add.overlap(this.player, this.altar, this.reachAltar, null, this);
  }

  createHeaderHUD(width) {
    const header = this.add.rectangle(width / 2, 24, width, 48, 0x140a06);
    header.setStrokeStyle(2, 0xd4a373);
    header.setDepth(20);

    this.levelBadge = this.add.text(28, 24, `LVL ${this.currentLevel}`, {
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffb703',
      fontFamily: 'Verdana'
    }).setOrigin(0, 0.5).setDepth(21);

    this.scoreText = this.add.text(width / 2, 24, `Modaks: 0 / ${this.targetModaks}`, {
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff',
      fontFamily: 'Verdana'
    }).setOrigin(0.5).setDepth(21);

    this.timerText = this.add.text(width - 28, 24, `Aarti: ${this.timeLeft}s`, {
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#06d6a0',
      fontFamily: 'Verdana'
    }).setOrigin(1, 0.5).setDepth(21);
  }

  createMobileControls(width, height) {
    const leftPadX = 75;
    const rightPadX = width - 75;
    const padY = height - 85;

    const makeBtn = (x, y, label, axis, dir) => {
      const circle = this.add.circle(x, y, 28, 0x3d1a08, 0.85)
        .setStrokeStyle(3, 0xffb703)
        .setInteractive()
        .setDepth(500);

      this.add.text(x, y, label, { 
        fontSize: '18px', 
        fontStyle: 'bold', 
        color: '#ffd166',
        fontFamily: 'Verdana'
      }).setOrigin(0.5).setDepth(501);

      circle.on('pointerdown', () => {
        circle.setFillStyle(0xd97706, 0.95);
        this.player.touchVelocity[axis] = dir;
      });

      const release = () => {
        circle.setFillStyle(0x3d1a08, 0.85);
        this.player.touchVelocity[axis] = 0;
      };

      circle.on('pointerup', release);
      circle.on('pointerout', release);
    };

    // Left Thumb: Vertical Movement (Up / Down)
    makeBtn(leftPadX, padY - 38, '▲', 'y', -1);
    makeBtn(leftPadX, padY + 38, '▼', 'y', 1);

    // Right Thumb: Horizontal Movement (Left / Right)
    makeBtn(rightPadX - 38, padY, '◄', 'x', -1);
    makeBtn(rightPadX + 38, padY, '►', 'x', 1);
  }

  tickSecond() {
    if (this.isGameOver) return;

    // 1. Aarti Countdown
    this.timeLeft -= 1;
    this.timerText.setText(`Aarti: ${this.timeLeft}s`);
    if (this.timeLeft <= 10) this.timerText.setColor('#ff3333');
    if (this.timeLeft <= 0) this.handleDefeat('Aarti began before offerings reached Ganesha!');

    // 2. Idle Detection (rings bell automatically after 8 seconds of camping)
    const distMoved = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.lastPlayerPos.x, this.lastPlayerPos.y);

    if (distMoved < 4) {
      this.idleSeconds += 1;

      if (this.idleSeconds >= 5 && this.idleSeconds < 8) {
        const left = 8 - this.idleSeconds;
        this.idleWarningText.setText(`🔔 Clink in ${left}s...`).setVisible(true);
      } else if (this.idleSeconds >= 8) {
        this.triggerAutomaticBellAlert();
        this.idleSeconds = 0;
        this.idleWarningText.setVisible(false);
      }
    } else {
      this.idleSeconds = 0;
      this.idleWarningText.setVisible(false);
    }

    this.lastPlayerPos = { x: this.player.x, y: this.player.y };
  }

  triggerAutomaticBellAlert() {
    if (this.isGameOver) return;

    if (window.SoundFX) window.SoundFX.bell();

    // Expanding chime wave
    const wave = this.add.circle(this.player.x, this.player.y, 12, 0xffd166, 0.7).setDepth(14);
    this.tweens.add({
      targets: wave,
      radius: 260,
      alpha: 0,
      duration: 750,
      onComplete: () => wave.destroy()
    });

    // Guards within range rush to inspect the sound
    const alertPoint = { x: this.player.x, y: this.player.y };
    this.guards.forEach(g => {
      const dist = Phaser.Math.Distance.Between(g.x, g.y, alertPoint.x, alertPoint.y);
      if (dist < 280) {
        g.distract(alertPoint);
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
    const cy = a.y + 60;
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
      { minX: a.x + 140, maxX: a.x + 260, minY: a.y + 130, maxY: a.y + 240 },
      { minX: a.x + a.w - 260, maxX: a.x - 140 + a.w, minY: a.y + 130, maxY: a.y + 240 },
      { minX: a.x + 150, maxX: a.x + 300, minY: a.y + 280, maxY: a.y + 380 },
      { minX: a.x + a.w - 300, maxX: a.x + a.w - 150, minY: a.y + 280, maxY: a.y + 380 },
      { minX: a.x + a.w / 2 - 100, maxX: a.x + a.w / 2 + 100, minY: a.y + 200, maxY: a.y + 320 }
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

  collectModak(player, modak) {
  modak.destroy();
  if (window.SoundFX) window.SoundFX.bell();
  this.score += 1;
  this.totalModaks += 1; // 1 modak = 1 lifetime point
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

  const cleared = this.levelsCleared + 1;
  const nextLvl = this.currentLevel + 1;

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
    this.scene.restart({
      level: nextLvl,
      levelsCleared: cleared,
      totalModaks: this.totalModaks
    });
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
      levelsCleared: this.levelsCleared,
      totalModaks: this.totalModaks
    });
  });
}

  update() {
    if (this.isGameOver) return;

    this.player.update();

    if (this.idleWarningText.visible) {
      this.idleWarningText.setPosition(this.player.x, this.player.y - 24);
    }

    for (const g of this.guards) {
      g.update(this.player, this.walls.getChildren(), () => {
        this.handleDefeat('A Temple Guard captured Mooshak!');
      });
    }
  }
}