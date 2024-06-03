import Phaser from "phaser";
import { HealthBar } from "../gui/health_bar";

class Keys {
    up:    Phaser.Input.Keyboard.Key;
    down:  Phaser.Input.Keyboard.Key;
    left:  Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;

    death_debug: Phaser.Input.Keyboard.Key;
    add_life_debug: Phaser.Input.Keyboard.Key;
    remove_life_debug: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene) {
        this.up    = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.down  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.left  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.space = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.death_debug = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.add_life_debug = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.remove_life_debug = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }
}

enum PlayerState {
    IDLE = "IDLE",
    MOVE = "MOVE",
    JUMP = "JUMP",
    FALL = "FALL",
    DEAD = "DEAD",
    FIRST_ATTACK = "FIRST_ATTACK",
    SECOND_ATTACK = "SECOND_ATTACK"
}

export class Player extends Phaser.Physics.Arcade.Sprite {
    keys: Keys;
    state_debug: Phaser.GameObjects.Text;
    fps_debug: Phaser.GameObjects.Text;
    attack_released: boolean;
    hitboxGraphics: Phaser.GameObjects.Graphics;
    max_health_point: number;
    private _health_point: number;
    health_bar: HealthBar;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setBounce(0);
        this.setCollideWorldBounds(true);

        this.body.setOffset(-16, -16);

        this.setup_animations();

        this.keys = new Keys(this.scene);
        this.state = PlayerState.IDLE;

        this.state_debug = this.scene.add.text(10, 10, this.state.toString());
        this.fps_debug = this.scene.add.text(this.scene.cameras.main.width - 120, 10, `FPS: ${this.getFPS()}`);

        this.attack_released = true;

        this.on('animationcomplete', this.handleAnimationComplete, this);

        this.hitboxGraphics = this.scene.add.graphics();
        this.hitboxGraphics.lineStyle(2, 0xFF0000);

        this.max_health_point = 20;
        this._health_point = 18;
        this.health_bar = new HealthBar(this.scene, this);
    }

    public get health_point(): number {
        return this._health_point;
    }

    public set health_point(value: number) {
        this._health_point = value;
        if (this._health_point > this.max_health_point) {
            this._health_point = this.max_health_point;
        }
        else if (this._health_point <= 0) {
            this._health_point = 0;
            this.state = PlayerState.DEAD;
            this.anims.play('dead');
        }
    }

    getFPS(): string {
        return this.scene.game.loop.actualFps.toFixed(2).toString();
    }

    update(): void {
        this.hitbox_update();
        // this.hitbox_graphics_update();

        if ([PlayerState.IDLE, PlayerState.JUMP, PlayerState.MOVE, PlayerState.FALL].includes(this.state as PlayerState)) {
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

            this.debug_commands();
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

        this.update_gui();
    }

    debug_commands() {
        if (this.keys.death_debug.isDown) {
            this.setVelocityX(0);
            this.state = PlayerState.DEAD;
            this.anims.play('dead', true);
        }

        if (this.keys.add_life_debug.isDown && this.keys.add_life_debug.getDuration() < 10) {
            this.health_point += 1;
        }

        if (this.keys.remove_life_debug.isDown && this.keys.remove_life_debug.getDuration() < 10) {
            this.health_point -= 1;
        }
    }

    update_gui() {
        this.health_bar.update();
        this.state_debug.setText(this.state.toString());
        this.fps_debug.setText(`FPS: ${this.getFPS()}`);
    }

    hitbox_update() {
        if (this.state === PlayerState.IDLE) {
            this.body.setSize(64, 80);
            this.body.setOffset(-20, -16);
        }
        else if (this.state === PlayerState.MOVE) {
            this.body.setSize(80, 80);
            this.body.setOffset(-20, -16);
        }
        else if (this.state === PlayerState.FIRST_ATTACK || this.state === PlayerState.SECOND_ATTACK) {
            this.body.setSize(96, 80);
            this.body.setOffset(-8, -16);
        }
        else if (this.state === PlayerState.DEAD) {
            this.body.setSize(80, 64);
            this.body.setOffset(0, -16);
        }
    }

    hitbox_graphics_update() {
        this.hitboxGraphics.clear();
        this.hitboxGraphics.lineStyle(2, 0xff0000);
        this.hitboxGraphics.strokeRect(
            this.body.x - this.body.offset.x,
            this.body.y - this.body.offset.y,
            this.body.width + this.body.offset.x,
            this.body.height + this.body.offset.y
        );
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
            key: 'first_attack',
            frames: this.anims.generateFrameNames('character_attack', { start: 0, end: 3 }),
            frameRate: 12
        });

        this.anims.create({
            key: 'second_attack',
            frames: this.anims.generateFrameNames('character_attack', { start: 4, end: 7 }),
            frameRate: 12
        });

        this.anims.create({
            key: 'dead',
            frames: this.anims.generateFrameNames('character_dead', { start: 0, end: 7 }),
            frameRate: 12
        });
    }
}