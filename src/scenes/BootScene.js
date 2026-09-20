export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.createAudioSynthesizer();
    this.generateProceduralTextures();
  }

  create() {
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
    // 1. Carved Ancient Temple Stone Floor (Tiled with subtle lotus mandala)
    {
      const cvs = document.createElement('canvas');
      cvs.width = 64;
      cvs.height = 64;
      const ctx = cvs.getContext('2d');

      // Base terracotta stone
      ctx.fillStyle = '#1c0f0a';
      ctx.fillRect(0, 0, 64, 64);

      // Stone border bevel
      ctx.fillStyle = '#26150e';
      ctx.fillRect(1, 1, 62, 62);

      // Subtle center stone relief
      ctx.fillStyle = '#1f110b';
      ctx.fillRect(3, 3, 58, 58);

      // Etched mortar lines
      ctx.strokeStyle = '#0d0604';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, 64, 64);

      // Carved floral corner accents
      ctx.fillStyle = 'rgba(212, 163, 115, 0.08)';
      ctx.beginPath();
      ctx.arc(32, 32, 14, 0, Math.PI * 2);
      ctx.fill();

      this.textures.addCanvas('floor_tile', cvs);
    }

    // 2. Elegant Mooshak (Layered mouse with ears, snout, tail, and red/gold vahana saddle)
    {
      const cvs = document.createElement('canvas');
      cvs.width = 36;
      cvs.height = 24;
      const ctx = cvs.getContext('2d');

      // Drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(18, 14, 14, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Curved thin tail
      ctx.strokeStyle = '#e0a899';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(4, 12);
      ctx.quadraticCurveTo(0, 6, 2, 2);
      ctx.stroke();

      // Plump mouse body
      const bodyGrad = ctx.createRadialGradient(16, 12, 2, 16, 12, 12);
      bodyGrad.addColorStop(0, '#a8a29e');
      bodyGrad.addColorStop(0.8, '#78716c');
      bodyGrad.addColorStop(1, '#57534e');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(17, 12, 11, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sacred Ganesha Vahana Saddle (Red Velvet with Gold fringe)
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(13, 7, 7, 10);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1;
      ctx.strokeRect(13, 7, 7, 10);

      // Little bell on the collar
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(22, 12, 2, 0, Math.PI * 2);
      ctx.fill();

      // Snout / Head
      ctx.fillStyle = '#8c857f';
      ctx.beginPath();
      ctx.ellipse(26, 12, 6, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pink Nose Tip
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(31, 12, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Shiny Black Eyes
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(26, 9, 1.2, 0, Math.PI * 2);
      ctx.arc(26, 15, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Soft Ears with pink interior
      const drawEar = (x, y) => {
        ctx.fillStyle = '#78716c';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f9a8d4';
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      };
      drawEar(21, 6);
      drawEar(21, 18);

      this.textures.addCanvas('player_tex', cvs);
    }

    // 3. Procedural Temple Prowler Cat (Replaces human guard with sleek temple feline)
    {
      const cvs = document.createElement('canvas');
      cvs.width = 44;
      cvs.height = 44;
      const ctx = cvs.getContext('2d');

      // Feline Floor Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.beginPath();
      ctx.ellipse(22, 24, 15, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sleek Dark Prowling Cat Body
      const furGrad = ctx.createRadialGradient(20, 20, 2, 20, 20, 14);
      furGrad.addColorStop(0, '#3e2723');
      furGrad.addColorStop(0.7, '#271711');
      furGrad.addColorStop(1, '#150a06');
      ctx.fillStyle = furGrad;
      ctx.beginPath();
      ctx.ellipse(20, 20, 13, 9, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // Curled Prowler Tail
      ctx.strokeStyle = '#271711';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(8, 22);
      ctx.quadraticCurveTo(2, 20, 3, 13);
      ctx.quadraticCurveTo(5, 7, 9, 8);
      ctx.stroke();

      // Cat Head
      ctx.fillStyle = '#271711';
      ctx.beginPath();
      ctx.arc(31, 19, 7.5, 0, Math.PI * 2);
      ctx.fill();

      // Pointed Cat Ears (Triangular with reddish-pink interior)
      const drawCatEar = (x1, y1, tipX, tipY, x2, y2) => {
        ctx.fillStyle = '#150a06';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff8a80';
        ctx.beginPath();
        ctx.moveTo(x1 + 1, y1);
        ctx.lineTo(tipX, tipY + 2);
        ctx.lineTo(x2 - 1, y2);
        ctx.closePath();
        ctx.fill();
      };
      drawCatEar(27, 13, 28, 6, 32, 12);
      drawCatEar(31, 13, 36, 7, 36, 15);

      // Glowing Amber Predator Eyes
      ctx.fillStyle = '#ffb703';
      ctx.beginPath();
      ctx.arc(33, 17, 1.8, 0, Math.PI * 2);
      ctx.arc(33, 21, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Slit Pupils
      ctx.fillStyle = '#000000';
      ctx.fillRect(33, 16, 0.9, 2);
      ctx.fillRect(33, 20, 0.9, 2);

      // Fine Whiskers
      ctx.strokeStyle = 'rgba(255, 214, 165, 0.85)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(35, 18); ctx.lineTo(42, 16);
      ctx.moveTo(35, 19); ctx.lineTo(43, 19);
      ctx.moveTo(35, 20); ctx.lineTo(42, 22);
      ctx.stroke();

      // Brass Temple Lantern Collar Bell
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(28, 25, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(28, 25, 1.5, 0, Math.PI * 2);
      ctx.fill();

      this.textures.addCanvas('guard_tex', cvs);
    }

    // 4. Artisanal Golden Modak with Fluted Folds & Kumkum Tip
    {
      const cvs = document.createElement('canvas');
      cvs.width = 28;
      cvs.height = 28;
      const ctx = cvs.getContext('2d');

      // Soft ambient golden warmth
      const glow = ctx.createRadialGradient(14, 14, 2, 14, 14, 13);
      glow.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(14, 14, 13, 0, Math.PI * 2);
      ctx.fill();

      // Modak Bell/Teardrop Shape
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(14, 4);
      ctx.bezierCurveTo(24, 16, 21, 23, 14, 23);
      ctx.bezierCurveTo(7, 23, 4, 16, 14, 4);
      ctx.fill();

      // Inner saffron butter highlights
      const modakShade = ctx.createLinearGradient(14, 4, 14, 23);
      modakShade.addColorStop(0, '#fef08a');
      modakShade.addColorStop(0.6, '#fde047');
      modakShade.addColorStop(1, '#ca8a04');
      ctx.fillStyle = modakShade;
      ctx.beginPath();
      ctx.moveTo(14, 5);
      ctx.bezierCurveTo(23, 16, 20, 22, 14, 22);
      ctx.bezierCurveTo(8, 22, 5, 16, 14, 5);
      ctx.fill();

      // Classic 21-fold pastry flutes (pinched ridges)
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(14, 5);
      ctx.lineTo(14, 22);
      ctx.moveTo(14, 5);
      ctx.quadraticCurveTo(11, 14, 10, 21);
      ctx.moveTo(14, 5);
      ctx.quadraticCurveTo(17, 14, 18, 21);
      ctx.stroke();

      // Sacred Kumkum Dot at the pinnacle
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(14, 4.5, 1.3, 0, Math.PI * 2);
      ctx.fill();

      this.textures.addCanvas('modak_tex', cvs);
    }

    // 5. Divine Garbhagriha Altar & Lord Ganesha Murti
    {
      const cvs = document.createElement('canvas');
      cvs.width = 68;
      cvs.height = 68;
      const ctx = cvs.getContext('2d');

      // Brass Pedestal (Peetha)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(4, 4, 60, 60);

      // Gold Filigree Border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(6, 6, 56, 56);

      // Red Sanctum Carpet
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(10, 10, 48, 48);

      // Lotus Petal Seat
      ctx.fillStyle = '#f43f5e';
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        ctx.beginPath();
        ctx.arc(34 + Math.cos(angle) * 14, 38 + Math.sin(angle) * 7, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Golden Lord Ganesha Silhouette / Idol
      const idolGrad = ctx.createLinearGradient(34, 16, 34, 48);
      idolGrad.addColorStop(0, '#fef08a');
      idolGrad.addColorStop(0.5, '#f59e0b');
      idolGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = idolGrad;

      // Crown (Mukut)
      ctx.beginPath();
      ctx.moveTo(34, 16);
      ctx.lineTo(40, 24);
      ctx.lineTo(28, 24);
      ctx.closePath();
      ctx.fill();

      // Head & Big Ears
      ctx.beginPath();
      ctx.arc(34, 30, 8, 0, Math.PI * 2);
      ctx.arc(24, 29, 5, 0, Math.PI * 2);
      ctx.arc(44, 29, 5, 0, Math.PI * 2);
      ctx.fill();

      // Curved Gentle Trunk (Vakratunda)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(34, 31);
      ctx.quadraticCurveTo(36, 39, 30, 40);
      ctx.stroke();

      // Sacred Tilak (Trishul / Kumkum on forehead)
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(33, 24, 2, 4);

      this.textures.addCanvas('altar_tex', cvs);
    }

    // 6. Glowing Brass Diya (Deepam)
    {
      const cvs = document.createElement('canvas');
      cvs.width = 24;
      cvs.height = 24;
      const ctx = cvs.getContext('2d');

      // Brass Bowl
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(12, 16, 9, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Oil Surface
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(12, 15, 6, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Flickering Flame
      const flame = ctx.createRadialGradient(12, 10, 1, 12, 10, 6);
      flame.addColorStop(0, '#ffffff');
      flame.addColorStop(0.3, '#fef08a');
      flame.addColorStop(0.7, '#f97316');
      flame.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = flame;
      ctx.beginPath();
      ctx.moveTo(12, 4);
      ctx.quadraticCurveTo(16, 11, 12, 13);
      ctx.quadraticCurveTo(8, 11, 12, 4);
      ctx.fill();

      this.textures.addCanvas('diya_tex', cvs);
    }

    // 7. Marigold Flower Petal Particle
    {
      const cvs = document.createElement('canvas');
      cvs.width = 12;
      cvs.height = 12;
      const ctx = cvs.getContext('2d');
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.ellipse(6, 6, 5, 2.5, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.ellipse(6, 6, 3, 1.5, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      this.textures.addCanvas('petal_tex', cvs);
    }
  }
}