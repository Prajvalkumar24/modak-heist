export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Keep preload empty or for external files only
  }

  create() {
    this.createAudioSynthesizer();
    this.generateProceduralTextures();
    this.scene.start('GameScene');
  }

  createAudioSynthesizer() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    window.SoundFX = {
      bell: () => {
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;
        [1046.5, 1567.98, 2093.0].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.18 / (idx + 1), now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.5);
        });
      },
      alert: () => {
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      },
      victory: () => {
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);
          gain.gain.setValueAtTime(0.2, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.65);
        });
      }
    };
  }

  generateProceduralTextures() {
    // 1. Tiled Floor
    {
      const cvs = document.createElement('canvas');
      cvs.width = 64;
      cvs.height = 64;
      const ctx = cvs.getContext('2d');
      ctx.fillStyle = '#1c0f0a';
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = '#26150e';
      ctx.fillRect(1, 1, 62, 62);
      ctx.strokeStyle = '#0d0604';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, 64, 64);
      ctx.fillStyle = 'rgba(212, 163, 115, 0.08)';
      ctx.beginPath();
      ctx.arc(32, 32, 14, 0, Math.PI * 2);
      ctx.fill();
      this.textures.addCanvas('floor_tile', cvs);
    }

    // 2. High-Visibility Mooshak (Registered to BOTH 'player' and 'player_tex')
    {
      const cvs = document.createElement('canvas');
      cvs.width = 36;
      cvs.height = 24;
      const ctx = cvs.getContext('2d');

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(18, 16, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tail
      ctx.strokeStyle = '#f4a261';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(6, 12);
      ctx.quadraticCurveTo(0, 6, 4, 3);
      ctx.stroke();

      // Mouse Body
      ctx.fillStyle = '#9ca3af';
      ctx.beginPath();
      ctx.ellipse(17, 12, 11, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Saffron & Gold Saddle
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(13, 6, 8, 12);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(13, 6, 8, 12);

      // Head & Snout
      ctx.fillStyle = '#d1d5db';
      ctx.beginPath();
      ctx.ellipse(26, 12, 6, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Nose & Whiskers
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(31, 12, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(28, 10); ctx.lineTo(34, 7);
      ctx.moveTo(28, 14); ctx.lineTo(34, 17);
      ctx.stroke();

      // Eyes
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(26, 9, 1.3, 0, Math.PI * 2);
      ctx.arc(26, 15, 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      const ear = (x, y) => {
        ctx.fillStyle = '#6b7280';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      };
      ear(20, 5);
      ear(20, 19);

      this.textures.addCanvas('player', cvs);
      this.textures.addCanvas('player_tex', cvs);
    }

    // 3. Realistic Sleek Temple Prowler Cat
    {
      const cvs = document.createElement('canvas');
      cvs.width = 44;
      cvs.height = 44;
      const ctx = cvs.getContext('2d');

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(22, 24, 16, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Arching Cat Torso
      ctx.fillStyle = '#1e1b18';
      ctx.beginPath();
      ctx.ellipse(18, 22, 13, 7.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Long Curled Tail
      ctx.strokeStyle = '#1e1b18';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(6, 22);
      ctx.quadraticCurveTo(0, 14, 4, 8);
      ctx.stroke();

      // Cat Head
      ctx.fillStyle = '#2b2621';
      ctx.beginPath();
      ctx.arc(29, 22, 7, 0, Math.PI * 2);
      ctx.fill();

      // Pointed Triangular Cat Ears
      const ear = (x1, y1, tipX, tipY, x2, y2) => {
        ctx.fillStyle = '#1e1b18';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#f87171';
        ctx.beginPath();
        ctx.moveTo(x1 + 1, y1);
        ctx.lineTo(tipX, tipY + 2);
        ctx.lineTo(x2 - 1, y2);
        ctx.closePath();
        ctx.fill();
      };
      ear(25, 16, 26, 8, 30, 15);
      ear(25, 28, 26, 36, 30, 29);

      // Emerald Eyes with slit pupils
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(31, 19, 2, 0, Math.PI * 2);
      ctx.arc(31, 25, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.fillRect(31, 18, 1, 2.5);
      ctx.fillRect(31, 24, 1, 2.5);

      // Whiskers
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(33, 20); ctx.lineTo(41, 16);
      ctx.moveTo(33, 24); ctx.lineTo(41, 28);
      ctx.stroke();

      this.textures.addCanvas('guard_tex', cvs);
      this.textures.addCanvas('guard', cvs);
    }

    // 4. Modak
    {
      const cvs = document.createElement('canvas');
      cvs.width = 28;
      cvs.height = 28;
      const ctx = cvs.getContext('2d');
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(14, 4);
      ctx.bezierCurveTo(24, 16, 21, 23, 14, 23);
      ctx.bezierCurveTo(7, 23, 4, 16, 14, 4);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(14, 5); ctx.lineTo(14, 22);
      ctx.moveTo(14, 5); ctx.quadraticCurveTo(11, 14, 10, 21);
      ctx.moveTo(14, 5); ctx.quadraticCurveTo(17, 14, 18, 21);
      ctx.stroke();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(14, 4.5, 1.3, 0, Math.PI * 2);
      ctx.fill();
      this.textures.addCanvas('modak_tex', cvs);
    }

    // 5. 3D Sculpted Brass Lord Ganesha Murti Statue
    {
      const cvs = document.createElement('canvas');
      cvs.width = 72;
      cvs.height = 72;
      const ctx = cvs.getContext('2d');

      // Stepped Pedestal
      ctx.fillStyle = '#291409';
      ctx.fillRect(4, 50, 64, 18);
      ctx.fillStyle = '#5c2d12';
      ctx.fillRect(8, 44, 56, 7);
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(12, 39, 48, 6);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(4, 50, 64, 18);

      // Golden Halo (Prabhavali)
      const halo = ctx.createRadialGradient(36, 25, 4, 36, 25, 23);
      halo.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
      halo.addColorStop(0.7, 'rgba(217, 119, 6, 0.35)');
      halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(36, 25, 23, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(36, 25, 19, Math.PI * 0.85, Math.PI * 2.15);
      ctx.stroke();

      // Brass Ganesha Body
      const brass = ctx.createLinearGradient(24, 15, 48, 42);
      brass.addColorStop(0, '#fef08a');
      brass.addColorStop(0.5, '#eab308');
      brass.addColorStop(1, '#a16207');
      ctx.fillStyle = brass;
      ctx.beginPath();
      ctx.ellipse(36, 36, 12, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Saffron Dhoti
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.ellipse(36, 42, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Broad Elephant Ears
      ctx.fillStyle = brass;
      ctx.beginPath();
      ctx.ellipse(22, 23, 7, 10, -0.2, 0, Math.PI * 2);
      ctx.ellipse(50, 23, 7, 10, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(36, 22, 9, 0, Math.PI * 2);
      ctx.fill();

      // High Crown (Mukut)
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(36, 6);
      ctx.lineTo(43, 16);
      ctx.lineTo(29, 16);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(36, 11, 2, 0, Math.PI * 2);
      ctx.fill();

      // Curved Trunk
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(36, 24);
      ctx.quadraticCurveTo(39, 32, 33, 34);
      ctx.stroke();

      // Tilak
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(35, 17, 2, 4);

      // Left hand holding golden modak
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(28, 34, 3, 0, Math.PI * 2);
      ctx.fill();

      // Right hand Abhaya Mudra
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(44, 32, 2.8, 0, Math.PI * 2);
      ctx.fill();

      this.textures.addCanvas('altar_tex', cvs);
    }

    // 6. Brass Diya
    {
      const cvs = document.createElement('canvas');
      cvs.width = 24;
      cvs.height = 24;
      const ctx = cvs.getContext('2d');
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(12, 16, 9, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(12, 10, 4, 0, Math.PI * 2);
      ctx.fill();
      this.textures.addCanvas('diya_tex', cvs);
    }

    // 7. Rose Petal
    {
      const cvs = document.createElement('canvas');
      cvs.width = 12;
      cvs.height = 12;
      const ctx = cvs.getContext('2d');
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.ellipse(6, 6, 5, 2.5, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      this.textures.addCanvas('petal_tex', cvs);
    }
  }
}