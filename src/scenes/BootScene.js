export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Procedural generation is executed in create() so Phaser registers canvas textures cleanly
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
        const freqs = [1046.5, 1567.98, 2093.0];
        freqs.forEach((freq, idx) => {
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
    // 1. Carved Ancient Temple Stone Floor
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

    // 2. High-Definition Mooshak (Mouse with Saffron/Gold Saddle, Big Ears, Whiskers & Tail)
    {
      const cvs = document.createElement('canvas');
      cvs.width = 40;
      cvs.height = 26;
      const ctx = cvs.getContext('2d');

      // Drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(18, 17, 15, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Long curled pink tail trailing behind
      ctx.strokeStyle = '#f4a261';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(7, 13);
      ctx.quadraticCurveTo(0, 8, 3, 3);
      ctx.stroke();

      // Plump Mouse Body
      const bGrad = ctx.createRadialGradient(18, 13, 2, 18, 13, 11);
      bGrad.addColorStop(0, '#a8a29e');
      bGrad.addColorStop(0.8, '#78716c');
      bGrad.addColorStop(1, '#57534e');
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.ellipse(18, 13, 11, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sacred Saffron & Gold Ceremonial Saddle
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(13, 6, 9, 14);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(13, 6, 9, 14);

      // Head & Snout (Facing forward right)
      ctx.fillStyle = '#d1d5db';
      ctx.beginPath();
      ctx.ellipse(28, 13, 7, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pink Nose Tip
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(35, 13, 2, 0, Math.PI * 2);
      ctx.fill();

      // Whiskers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(31, 11); ctx.lineTo(39, 8);
      ctx.moveTo(31, 15); ctx.lineTo(39, 18);
      ctx.stroke();

      // Shiny Black Eyes
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(28, 9.5, 1.4, 0, Math.PI * 2);
      ctx.arc(28, 16.5, 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Round Ears with pink interior
      const drawEar = (x, y) => {
        ctx.fillStyle = '#6b7280';
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      };
      drawEar(22, 5.5);
      drawEar(22, 20.5);

      // Register under all possible keys so missing texture errors never trigger
      this.textures.addCanvas('player_tex', cvs);
      this.textures.addCanvas('player', cvs);
      this.textures.addCanvas('mooshak_tex', cvs);
    }

    // 3. Realistic Sleek Temple Prowler Cat (Pointed Feline Silhouette, Facing Right)
    {
      const cvs = document.createElement('canvas');
      cvs.width = 46;
      cvs.height = 36;
      const ctx = cvs.getContext('2d');

      // Drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(22, 20, 16, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Curled Feline Tail trailing behind
      ctx.strokeStyle = '#18120c';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(10, 18);
      ctx.quadraticCurveTo(2, 17, 4, 10);
      ctx.quadraticCurveTo(6, 4, 12, 6);
      ctx.stroke();

      // Sleek Dark Cat Torso
      const cGrad = ctx.createLinearGradient(8, 18, 30, 18);
      cGrad.addColorStop(0, '#1a0f08');
      cGrad.addColorStop(0.6, '#2e1c12');
      cGrad.addColorStop(1, '#3d2518');
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.ellipse(19, 18, 12, 7.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cat Head
      ctx.fillStyle = '#26160e';
      ctx.beginPath();
      ctx.ellipse(30, 18, 6.5, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pointed Triangular Cat Ears
      const ear = (baseX, baseY, tipX, tipY, frontX, frontY) => {
        ctx.fillStyle = '#150a04';
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(frontX, frontY);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#e57373';
        ctx.beginPath();
        ctx.moveTo(baseX + 0.5, baseY);
        ctx.lineTo(tipX + 1, tipY + (baseY > 18 ? -1 : 1));
        ctx.lineTo(frontX, frontY);
        ctx.closePath();
        ctx.fill();
      };
      ear(26, 13, 23, 5, 30, 12);  // Left Ear
      ear(26, 23, 23, 31, 30, 24); // Right Ear

      // Piercing Yellow-Green Cat Eyes (Facing forward directly into the vision cone)
      ctx.fillStyle = '#a3e635';
      ctx.beginPath();
      ctx.arc(33, 15, 1.8, 0, Math.PI * 2);
      ctx.arc(33, 21, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Slit Pupils
      ctx.fillStyle = '#000000';
      ctx.fillRect(33, 13.8, 0.8, 2.4);
      ctx.fillRect(33, 19.8, 0.8, 2.4);

      // Whiskers radiating forward
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(33, 15); ctx.lineTo(41, 11);
      ctx.moveTo(34, 18); ctx.lineTo(43, 18);
      ctx.moveTo(33, 21); ctx.lineTo(41, 25);
      ctx.stroke();

      this.textures.addCanvas('guard_tex', cvs);
      this.textures.addCanvas('guard', cvs);
    }

    // 4. Artisanal Golden Modak with Fluted Folds & Kumkum Tip
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

    // 5. 3D Sculpted Brass Lord Ganesha Murti Statue & Stepped Pedestal
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

      // Left hand holding modak
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