export default class Guard extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, arena) {
    const startX = Phaser.Math.Between(arena.x + 80, arena.x + arena.w - 80);
    const startY = Phaser.Math.Between(arena.y + 160, arena.y + arena.h - 80);
    super(scene, startX, startY, 'guard_tex');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(15);
    this.arena = arena;
    this.patrolSpeed = 80;
    this.chaseSpeed = 135;
    this.investigateSpeed = 95;
    this.visionRadius = 160;
    this.visionAngle = Phaser.Math.DegToRad(60);
    this.facingAngle = Phaser.Math.FloatBetween(0, Math.PI * 2);

    this.state = 'WANDER'; // 'WANDER', 'LOOK_AROUND', 'INVESTIGATE', 'CHASE'
    this.targetPoint = this.getRandomFloorPoint();
    this.stateTimer = 0;

    this.visionGraphics = scene.add.graphics();
    this.visionGraphics.setDepth(5);

    // Alert indicator icon ("!" text)
    this.alertText = scene.add.text(this.x, this.y - 24, '!', {
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#ff0000',
      fontFamily: 'Verdana'
    }).setOrigin(0.5).setDepth(25).setVisible(false);
  }

  getRandomFloorPoint() {
    return {
      x: Phaser.Math.Between(this.arena.x + 60, this.arena.x + this.arena.w - 60),
      y: Phaser.Math.Between(this.arena.y + 140, this.arena.y + this.arena.h - 60)
    };
  }

  distract(point) {
    if (this.state === 'CHASE') return;
    this.state = 'INVESTIGATE';
    this.targetPoint = { x: point.x, y: point.y };
    this.stateTimer = 180; // 3 seconds at 60fps
    this.alertText.setText('?').setColor('#ffb703').setVisible(true);
  }

  update(player, walls = [], onCatch) {
    this.alertText.setPosition(this.x, this.y - 24);

    if (this.state === 'CHASE') {
      this.alertText.setText('!').setColor('#ff0000').setVisible(true);
      this.chasePlayer(player, onCatch);
    } else if (this.state === 'INVESTIGATE') {
      this.investigateDistraction();
      this.scanForPlayer(player, walls);
    } else if (this.state === 'LOOK_AROUND') {
      this.alertText.setVisible(false);
      this.lookAround();
      this.scanForPlayer(player, walls);
    } else {
      this.alertText.setVisible(false);
      this.wander();
      this.scanForPlayer(player, walls);
    }

    this.renderVisionCone(walls);
  }

  investigateDistraction() {
    const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetPoint.x, this.targetPoint.y);
    if (dist < 20 || --this.stateTimer <= 0) {
      this.setVelocity(0);
      this.state = 'LOOK_AROUND';
      this.stateTimer = 60;
      this.alertText.setVisible(false);
      return;
    }

    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPoint.x, this.targetPoint.y);
    this.facingAngle = Phaser.Math.Angle.RotateTo(this.facingAngle, angle, 0.1);
    this.setRotation(this.facingAngle);

    this.setVelocity(
      Math.cos(this.facingAngle) * this.investigateSpeed,
      Math.sin(this.facingAngle) * this.investigateSpeed
    );
  }

  wander() {
    const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetPoint.x, this.targetPoint.y);

    if (dist < 15 || (this.body.blocked.left || this.body.blocked.right || this.body.blocked.up || this.body.blocked.down)) {
      this.setVelocity(0);
      this.state = 'LOOK_AROUND';
      this.stateTimer = Phaser.Math.Between(40, 80);
      return;
    }

    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPoint.x, this.targetPoint.y);
    this.facingAngle = Phaser.Math.Angle.RotateTo(this.facingAngle, angle, 0.08);
    this.setRotation(this.facingAngle);

    this.setVelocity(
      Math.cos(this.facingAngle) * this.patrolSpeed,
      Math.sin(this.facingAngle) * this.patrolSpeed
    );
  }

  lookAround() {
    this.stateTimer--;
    this.facingAngle += 0.035;
    this.setRotation(this.facingAngle);

    if (this.stateTimer <= 0) {
      this.targetPoint = this.getRandomFloorPoint();
      this.state = 'WANDER';
    }
  }

  scanForPlayer(player, walls) {
    const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    if (dist > this.visionRadius) return;

    const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    const diff = Phaser.Math.Angle.Normalize(angleToPlayer - this.facingAngle);
    const halfFov = this.visionAngle / 2;

    if (diff <= halfFov || diff >= Math.PI * 2 - halfFov) {
      const ray = new Phaser.Geom.Line(this.x, this.y, player.x, player.y);
      let blocked = false;

      for (const wall of walls) {
        if (Phaser.Geom.Intersects.LineToRectangle(ray, wall.getBounds())) {
          blocked = true;
          break;
        }
      }

      if (!blocked) {
        this.state = 'CHASE';
        if (window.SoundFX) window.SoundFX.alert();
      }
    }
  }

  chasePlayer(player, onCatch) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.facingAngle = angle;
    this.setRotation(angle);

    this.setVelocity(
      Math.cos(angle) * this.chaseSpeed,
      Math.sin(angle) * this.chaseSpeed
    );

    if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) < 26) {
      onCatch();
    }
  }

  renderVisionCone(walls) {
    this.visionGraphics.clear();
    const coneColor = this.state === 'CHASE' ? 0xd90429 : 0xffaa00;
    const coneAlpha = this.state === 'CHASE' ? 0.42 : 0.22;

    const numRays = 16;
    const startAngle = this.facingAngle - this.visionAngle / 2;
    const step = this.visionAngle / numRays;

    this.visionGraphics.fillStyle(coneColor, coneAlpha);
    this.visionGraphics.beginPath();
    this.visionGraphics.moveTo(this.x, this.y);

    for (let i = 0; i <= numRays; i++) {
      const angle = startAngle + step * i;
      let rayLen = this.visionRadius;

      const targetX = this.x + Math.cos(angle) * this.visionRadius;
      const targetY = this.y + Math.sin(angle) * this.visionRadius;
      const ray = new Phaser.Geom.Line(this.x, this.y, targetX, targetY);

      for (const wall of walls) {
        const bounds = wall.getBounds();
        const lines = [
          new Phaser.Geom.Line(bounds.left, bounds.top, bounds.right, bounds.top),
          new Phaser.Geom.Line(bounds.right, bounds.top, bounds.right, bounds.bottom),
          new Phaser.Geom.Line(bounds.right, bounds.bottom, bounds.left, bounds.bottom),
          new Phaser.Geom.Line(bounds.left, bounds.bottom, bounds.left, bounds.top)
        ];

        for (const line of lines) {
          const out = new Phaser.Geom.Point();
          if (Phaser.Geom.Intersects.LineToLine(ray, line, out)) {
            const hitDist = Phaser.Math.Distance.Between(this.x, this.y, out.x, out.y);
            if (hitDist < rayLen) rayLen = hitDist;
          }
        }
      }

      this.visionGraphics.lineTo(
        this.x + Math.cos(angle) * rayLen,
        this.y + Math.sin(angle) * rayLen
      );
    }

    this.visionGraphics.closePath();
    this.visionGraphics.fillPath();
  }

  destroy(fromScene) {
    if (this.visionGraphics) {
      this.visionGraphics.clear();
      this.visionGraphics.destroy();
    }
    if (this.alertText) {
      this.alertText.destroy();
    }
    super.destroy(fromScene);
  }
}