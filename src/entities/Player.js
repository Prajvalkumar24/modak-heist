export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    // Primary key 'player_tex' registered in BootScene
    super(scene, x, y, 'player_tex');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(15);
    this.setCollideWorldBounds(true);
    this.body.setSize(22, 16);
    this.body.setOffset(7, 4);

    this.moveSpeed = 165;
    this.touchVelocity = { x: 0, y: 0 };

    // Keyboard cursors
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
  }

  update() {
    let vx = 0;
    let vy = 0;

    // Desktop: Keyboard WASD / Arrows
    if (this.cursors.left.isDown || this.wasd.left.isDown) vx -= 1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx += 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy -= 1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) vy += 1;

    // Mobile: Touch Controls
    if (this.touchVelocity.x !== 0) vx = this.touchVelocity.x;
    if (this.touchVelocity.y !== 0) vy = this.touchVelocity.y;

    if (vx !== 0 && vy !== 0) {
      // Normalize diagonal movement speed
      vx *= 0.7071;
      vy *= 0.7071;
    }

    this.setVelocity(vx * this.moveSpeed, vy * this.moveSpeed);

    // Rotate Mooshak towards moving direction
    if (vx !== 0 || vy !== 0) {
      this.rotation = Math.atan2(vy, vx);
    }
  }
}