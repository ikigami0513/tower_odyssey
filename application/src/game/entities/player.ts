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

enum PlayerState {
    IDLE = "IDLE",
    MOVE = "MOVE",
    JUMP = "JUMP",
    FIRST_ATTACK = "FIRST_ATTACK",
    SECOND_ATTACK = "SECOND_ATTACK"
}

export class Player extends Phaser.Physics.Arcade.Sprite {
    keys: Keys;
    state_debug: Phaser.GameObjects.Text;
    fps_debug: Phaser.GameObjects.Text;
    attack_released: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setBounce(0);
        this.setCollideWorldBounds(true);

        this.body.setOffset(-8, -16);

        this.setup_animations();

        this.keys = new Keys(this.scene);
        this.state = PlayerState.IDLE;

        this.state_debug = this.scene.add.text(10, 10, this.state.toString());
        this.fps_debug = this.scene.add.text(this.scene.cameras.main.width - 100, 10, `FPS: ${this.getFPS()}`);

        this.attack_released = true;

        this.on('animationcomplete', this.handleAnimationComplete, this);
    }

    getFPS(): string {
        return this.scene.game.loop.actualFps.toFixed(2).toString();
    }

    update(): void {
        if ([PlayerState.IDLE, PlayerState.JUMP, PlayerState.MOVE].includes(this.state as PlayerState)) {
            if (this.keys.left.isDown) {
                this.setVelocityX(-160);
                this.flipX = true;
                if (this.body.touching.down) {
                    this.anims.play('run', true);
                    this.state = PlayerState.MOVE;
                }
            }
            else if (this.keys.right.isDown) {
                this.setVelocityX(160);
                this.flipX = false;
                if (this.body.touching.down) {
                    this.anims.play('run', true);
                    this.state = PlayerState.MOVE;
                }
            }
            else {
                this.setVelocityX(0);
                if (this.body.touching.down && this.anims.currentAnim?.key !== 'idle') {
                    this.anims.play('idle');
                    this.state = PlayerState.IDLE;
                }
            }
    
            if (this.keys.up.isDown && this.body.touching.down) {
                this.anims.play('jump', true);
                this.state = PlayerState.JUMP;
                this.setVelocityY(-330);
            }

            if (this.keys.space.isDown && this.body.touching.down && this.attack_released) {
                this.setVelocityX(0)
                this.anims.play('first_attack', true);
                this.state = PlayerState.FIRST_ATTACK;
                this.attack_released = false;
            }

            if (this.keys.space.isUp) {
                this.attack_released = true;
            }
        }
        else if (this.state == PlayerState.FIRST_ATTACK) {
            if (this.keys.space.isDown && this.body.touching.down && this.attack_released) {
                this.state = PlayerState.SECOND_ATTACK;
                this.attack_released = false;
            }

            if (this.keys.space.isUp) {
                this.attack_released = true;
            }
        }

        this.state_debug.setText(this.state.toString());
        this.fps_debug.setText(`FPS: ${this.getFPS()}`);
    }

    handleAnimationComplete(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) {
        if (animation.key === 'first_attack') {
            if (this.state === PlayerState.SECOND_ATTACK) {
                this.anims.play('second_attack', true);
            }
            else {
                this.state = PlayerState.IDLE;
                this.anims.play('idle', true);
            }
        }
        else if (animation.key === 'second_attack') {
            this.state = PlayerState.IDLE;
            this.anims.play('idle', true);
        }
    }

    setup_animations(): void {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers("character_idle", { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNames("character_run", { start: 0, end: 7 }),
            frameRate: 12,
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNames('character_jump', { start: 0, end: 14 }),
            frameRate: 12
        });

        this.anims.create({
            key: 'end_jump',
            frames: this.anims.generateFrameNames('character_end_jump', { start: 0, end: 2 }),
            frameRate: 12
        });

        this.anims.create({
            key: 'first_attack',
            frames: this.anims.generateFrameNames('character_attack', { start: 0, end: 3 }),
            frameRate: 12
        });

        this.anims.create({
            key: 'second_attack',
            frames: this.anims.generateFrameNames('character_attack', { start: 4, end: 7 }),
            frameRate: 12
        });
    }
}