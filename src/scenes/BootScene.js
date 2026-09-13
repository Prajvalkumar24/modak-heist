export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.createTextures();
    this.createAudioSynthesizer();
    this.scene.start('GameScene');
  }

  createTextures() {
    // 1. Terracotta Temple Stone Tile (64x64)
    const t = this.make.graphics({ x: 0, y: 0, add: false });
    t.fillStyle(0x23120b); // Deep terracotta base
    t.fillRect(0, 0, 64, 64);
    t.fillStyle(0x2a170e); // Inner raised paver
    t.fillRect(2, 2, 60, 60);
    t.lineStyle(1, 0x140a06); // Dark stone grout lines
    t.strokeRect(0, 0, 64, 64);
    t.lineStyle(1, 0x3d2014); // Subtle highlight edge
    t.strokeLineShape(new Phaser.Geom.Line(2, 2, 62, 2));
    t.strokeLineShape(new Phaser.Geom.Line(2, 2, 2, 62));
    t.generateTexture('floor_tile', 64, 64);

    // 2. Brass Diya Lamp with Flame (24x24)
    const d = this.make.graphics({ x: 0, y: 0, add: false });
    d.fillStyle(0xd4a373); // Brass base
    d.fillEllipse(12, 16, 18, 10);
    d.fillStyle(0x9c6644); // Inner oil bowl
    d.fillEllipse(12, 14, 14, 6);
    d.fillStyle(0xffb703); // Golden flame body
    d.fillTriangle(12, 2, 8, 14, 16, 14);
    d.fillStyle(0xff006e); // Fiery inner core
    d.fillTriangle(12, 6, 10, 14, 14, 14);
    d.generateTexture('diya_tex', 24, 24);

    // 3. Mooshak (Player Mouse)
    const m = this.make.graphics({ x: 0, y: 0, add: false });
    m.fillStyle(0x8d99ae);
    m.fillEllipse(16, 16, 24, 18);
    m.fillStyle(0xffb4a2);
    m.fillCircle(8, 7, 5);
    m.fillCircle(8, 25, 5);
    m.fillStyle(0x1d3557);
    m.fillCircle(24, 12, 2.5);
    m.fillCircle(24, 20, 2.5);
    m.fillStyle(0xffbe0b);
    m.fillRect(15, 14, 5, 4);
    m.generateTexture('mooshak_tex', 32, 32);

    // 4. Temple Guard (Menacing armor, glowing eyes, weapon)
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x1a1a1a);
    g.fillCircle(18, 18, 16);
    g.fillStyle(0x9d0208);
    g.fillRect(6, 4, 24, 8);
    g.fillStyle(0xff0000);
    g.fillCircle(24, 14, 2.5);
    g.fillCircle(24, 22, 2.5);
    g.fillStyle(0xffb703);
    g.fillTriangle(30, 18, 36, 14, 36, 22);
    g.generateTexture('guard_tex', 38, 36);

    // 5. Lord Ganesha Altar (Garbhagriha Shrine)
    const a = this.make.graphics({ x: 0, y: 0, add: false });
    a.fillStyle(0x4a0e4e);
    a.fillRoundedRect(4, 4, 72, 72, 8);
    a.lineStyle(3, 0xffb703);
    a.strokeRoundedRect(4, 4, 72, 72, 8);
    a.fillStyle(0xffb703, 0.25);
    a.fillCircle(40, 40, 32);
    a.fillStyle(0xf77f00);
    a.fillCircle(40, 32, 16);
    a.fillEllipse(40, 48, 24, 18);
    a.fillStyle(0xd90429);
    a.fillTriangle(40, 8, 30, 24, 50, 24);
    a.lineStyle(4, 0xf77f00);
    a.strokeLineShape(new Phaser.Geom.Line(40, 32, 40, 44));
    a.strokeLineShape(new Phaser.Geom.Line(40, 44, 47, 42));
    a.fillStyle(0xffe3a8);
    a.fillCircle(12, 14, 4);
    a.fillCircle(68, 14, 4);
    a.generateTexture('altar_tex', 80, 80);

    // 6. Sacred Modak
    const mo = this.make.graphics({ x: 0, y: 0, add: false });
    mo.fillStyle(0xffc300);
    mo.beginPath();
    mo.moveTo(14, 2);
    mo.lineTo(26, 24);
    mo.lineTo(2, 24);
    mo.closePath();
    mo.fillPath();
    mo.fillStyle(0xf77f00);
    mo.fillTriangle(14, 4, 16, 24, 12, 24);
    mo.generateTexture('modak_tex', 28, 28);

    // 7. Flower Petal (Celebration FX)
    const p = this.make.graphics({ x: 0, y: 0, add: false });
    p.fillStyle(0xff5400);
    p.fillCircle(4, 4, 4);
    p.generateTexture('petal_tex', 8, 8);
  }

  createAudioSynthesizer() {
    window.SoundFX = {
      ctx: new (window.AudioContext || window.webkitAudioContext)(),
      playTone(freq, type, duration, gainVal = 0.15) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      },
      bell() {
        this.playTone(987.77, 'sine', 0.8, 0.2);
        setTimeout(() => this.playTone(1318.51, 'sine', 0.6, 0.15), 90);
      },
      alert() {
        this.playTone(140, 'sawtooth', 0.5, 0.3);
      },
      victory() {
        [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => {
          setTimeout(() => this.playTone(n, 'triangle', 0.6, 0.2), i * 140);
        });
      }
    };
  }
}