export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'mooshak_tex');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDepth(15);
    this.speed = 175;

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Virtual Touch Vector (for mobile touch controls)
    this.touchVelocity = { x: 0, y: 0 };

    // Movement dust emitter
    this.dustEmitter = scene.add.particles(0, 0, 'petal_tex', {
      speed: { min: 5, max: 20 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 300,
      blendMode: 'ADD',
      frequency: 90,
      emitting: false
    }).setDepth(12);
  }

  update() {
    let vx = 0;
    let vy = 0;

    // Keyboard Input
    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -this.speed;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = this.speed;

    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -this.speed;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = this.speed;

    // Touch / Mobile D-Pad Override
    if (this.touchVelocity.x !== 0 || this.touchVelocity.y !== 0) {
      vx = this.touchVelocity.x * this.speed;
      vy = this.touchVelocity.y * this.speed;
    }

    this.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      const angle = Math.atan2(vy, vx);
      this.setRotation(angle);
      this.dustEmitter.setPosition(this.x - Math.cos(angle) * 12, this.y - Math.sin(angle) * 12);
      this.dustEmitter.emitting = true;
    } else {
      this.dustEmitter.emitting = false;
    }
  }

  destroy(fromScene) {
    if (this.dustEmitter) this.dustEmitter.destroy();
    super.destroy(fromScene);
  }
}