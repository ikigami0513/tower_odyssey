import Phaser from "phaser";
import { HealthBar } from "../gui/health_bar";
import { LevelMenu } from "../gui/level_menu";
import { LevelScene } from "../scenes/level.scene";

class Keys {
    up:    Phaser.Input.Keyboard.Key;
    down:  Phaser.Input.Keyboard.Key;
    left:  Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
    menu: Phaser.Input.Keyboard.Key;
    screenshot: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene) {
        this.up    = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.down  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.left  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.space = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.menu = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.screenshot = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    }
}

enum PlayerState {
    IDLE = "IDLE",
    MOVE = "MOVE",
    JUMP = "JUMP",
    DEAD = "DEAD",
    MENU = "MENU",
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
    show_hitbox: boolean;
    level_menu: LevelMenu;
    just_screenshot: boolean;

    constructor(scene: LevelScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setBounce(0);
        this.setCollideWorldBounds(true);

        this.body.setOffset(-16, -16);

        this.setup_animations();

        this.keys = new Keys(this.scene);
        this.state = PlayerState.IDLE;

        this.state_debug = this.scene.add.text(10, 10, this.state.toString(), { color: '#000000' });
        this.fps_debug = this.scene.add.text(this.scene.cameras.main.width - 120, 10, `FPS: ${this.getFPS()}`, { color: '#000000' });

        this.state_debug.setScrollFactor(0);
        this.fps_debug.setScrollFactor(0);

        this.attack_released = true;
        this.just_screenshot = false;

        this.on('animationcomplete', this.handleAnimationComplete, this);

        this.hitboxGraphics = this.scene.add.graphics();
        this.hitboxGraphics.lineStyle(2, 0xFF0000);

        this.max_health_point = 20;
        this._health_point = this.max_health_point;
        this.health_bar = new HealthBar(this.scene, this);

        this.show_hitbox = false;
        this.level_menu = new LevelMenu(this.scene, this);
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
        if (this.keys.screenshot.isDown) {
            if (!this.just_screenshot) {
                // @ts-ignore
                window.api.screenshot();
                this.just_screenshot = true;
            }
        } else {
            this.just_screenshot = false;
        }

        if (this.level_menu.menu.visible || this.level_menu.quit_confirm_dialog.dialog.visible) {
            return;
        }

        this.hitbox_update();
        if (this.show_hitbox) {
            this.hitbox_graphics_update();
        }

        if (this.keys.menu.isDown) {
            this.pause();
        }

        if (this.body.blocked.down && this.state === PlayerState.JUMP) {
            this.state = PlayerState.IDLE;
            this.anims.play('idle', true);
        }

        if ([PlayerState.IDLE, PlayerState.JUMP, PlayerState.MOVE].includes(this.state as PlayerState)) {
            if (this.keys.left.isDown) {
                this.setVelocityX(-160);
                this.flipX = true;
                if (this.state !== PlayerState.JUMP) {
                    this.anims.play('run', true);
                    this.state = PlayerState.MOVE;
                }
            }
            else if (this.keys.right.isDown) {
                this.setVelocityX(160);
                this.flipX = false;
                if (this.state !== PlayerState.JUMP) {
                    this.anims.play('run', true);
                    this.state = PlayerState.MOVE;
                }
            }
            else {
                this.setVelocityX(0);
                if (this.state !== PlayerState.JUMP && this.anims.currentAnim?.key !== 'idle') {
                    this.anims.play('idle');
                    this.state = PlayerState.IDLE;
                }
            }
    
            if (this.keys.up.isDown && this.state !== PlayerState.JUMP) {
                this.anims.play('jump', true);
                this.state = PlayerState.JUMP;
                this.setVelocityY(-330);
            }

            if (this.keys.space.isDown && this.state !== PlayerState.JUMP && this.attack_released) {
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
            if (this.keys.space.isDown && this.attack_released) {
                this.state = PlayerState.SECOND_ATTACK;
                this.attack_released = false;
            }

            if (this.keys.space.isUp) {
                this.attack_released = true;
            }
        }

        this.update_gui();
    }

    update_gui() {
        this.health_bar.update();
        this.state_debug.setText(this.state.toString());
        this.fps_debug.setText(`FPS: ${this.getFPS()}`);
    }

    hitbox_update() {
        this.body.setSize(this.texture.source[0].width, this.texture.source[0].height);

        if (this.texture.key === "character_dead_8") {
            this.body.setOffset(0, -4);
        }
        else if (this.texture.key.includes('character_attack')) {
            this.body.setOffset(0, -16);
        }
        else {
            this.body.setOffset(0, 0);
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

    pause(): void {
        this.level_menu.menu.setVisible(true);
        this.scene.time.paused = true;
        this.scene.physics.world.pause();
        this.anims.pause();
        this.health_bar.pause(); 
    }

    resume(): void {
        this.level_menu.menu.setVisible(false);
        this.scene.time.paused = false;
        this.scene.physics.world.resume();
        this.anims.resume();
        this.health_bar.resume();
    }

    setup_animations(): void {
        const character_idle_frames = ['character_idle_1', 'character_idle_2', 'character_idle_3', 'character_idle_4']
        this.anims.create({
            key: 'idle',
            frames: character_idle_frames.map(frame => ({ key: frame })),
            frameRate: 12,
            repeat: -1
        });

        const character_run_frames = [];
        for (let i = 1; i < 9; i++) {
            character_run_frames.push(`character_run_${i}`);
        }
        this.anims.create({
            key: "run",
            frames: character_run_frames.map(frame => ({ key: frame })),
            frameRate: 12
        });

        const character_jump_frames = [];
        for (let i = 1; i < 16; i++) {
            character_jump_frames.push(`character_jump_${i}`)
        }
        this.anims.create({
            key: 'jump',
            frames: character_jump_frames.map(frame => ({ key: frame })),
            frameRate: 12
        });

        const character_first_attack_frames = [];
        for (let i = 1; i < 5; i++) {
            character_first_attack_frames.push(`character_attack_${i}`);
        }
        this.anims.create({
            key: 'first_attack',
            frames: character_first_attack_frames.map(frame => ({ key: frame })),
            frameRate: 12
        });
 
        const character_second_attack_frames = [];
        for (let i = 5; i < 9; i++) {
            character_second_attack_frames.push(`character_attack_${i}`);
        }
        this.anims.create({
            key: 'second_attack',
            frames: character_second_attack_frames.map(frame => ({ key: frame })),
            frameRate: 12
        });

        const character_dead_frames = [];
        for (let i = 1; i < 9; i++) {
            character_dead_frames.push(`character_dead_${i}`);
        }
        this.anims.create({
            key: 'dead',
            frames: character_dead_frames.map(frame => ({ key: frame })),
            frameRate: 12
        });
    }
}
