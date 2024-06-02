import Phaser from "phaser";

class Keys {
    up:    Phaser.Input.Keyboard.Key;
    down:  Phaser.Input.Keyboard.Key
    left:  Phaser.Input.Keyboard.Key
    right: Phaser.Input.Keyboard.Key
    space: Phaser.Input.Keyboard.Key

    constructor(scene: Phaser.Scene) {
        this.up    = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
        this.down  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        this.left  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        this.right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        this.space = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }
}

export class Player extends Phaser.Physics.Arcade.Sprite {
    keys: Keys;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        this.setup_animations();

        this.keys = new Keys(this.scene);
    }

    update(): void {
        if (this.keys.left.isDown) {
            this.setVelocityX(-160);
            this.anims.play('run_right', true);
        }
        else if (this.keys.right.isDown) {
            this.setVelocityX(160);
            this.anims.play('run_right', true);
        }
        else {
            this.setVelocityX(0);
            if (this.anims.currentAnim?.key !== 'idle') {
                this.anims.play('idle');
            }
        }

        if (this.keys.space.isDown && this.body.touching.down) {
            this.setVelocityY(-330);
        }
    }

    setup_animations(): void {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers("character_idle", { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: "run_right",
            frames: this.anims.generateFrameNames("character_run", { start: 0, end: 7 }),
            frameRate: 5,
        });
    }
}