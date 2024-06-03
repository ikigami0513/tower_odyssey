import Phaser from "phaser";
import { Player } from "../entities/player";

export class TutoScene extends Phaser.Scene {
    platforms!: Phaser.Physics.Arcade.StaticGroup;
    player!: Player;

    preload() {
        this.load.image('sky', 'assets/background/sky.png');
        this.load.image('ground', 'assets/platform.png');

        this.load.image('empty_health', 'assets/hud/health/empty.png');
        this.load.image('half_health_1', 'assets/hud/health/half_1.png');
        this.load.image('half_health_2', 'assets/hud/health/half_2.png');
        this.load.image('full_health_1', 'assets/hud/health/full_1.png');
        this.load.image('full_health_2', 'assets/hud/health/full_2.png');
        this.load.image('golden_health_1', 'assets/hud/health/golden_1.png');
        this.load.image('golden_health_2', 'assets/hud/health/golden_2.png');

        this.load.spritesheet('character_idle',
            'assets/character/idle/idle_sheet.png',
            { frameWidth: 64, frameHeight: 80 }
        );
        this.load.spritesheet('character_run',
            'assets/character/run/run_sheet.png',
            { frameWidth: 80, frameHeight: 80 }
        );
        this.load.spritesheet('character_jump',
            'assets/character/jump/jump_sheet.png',
            { frameWidth: 64, frameHeight: 64 }
        );
        this.load.spritesheet('character_attack',
            'assets/character/attack/attack_sheet.png',
            { frameWidth: 96, frameHeight: 80 }
        );
        this.load.spritesheet('character_dead',
            'assets/character/dead/dead_sheet.png',
            { frameWidth: 80, frameHeight: 64 }
        );
    }

    create() {
        const sky = this.add.image(400, 300, 'sky');
        sky.setDisplaySize(this.scale.width, this.scale.height);

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = new Player(this, 100, 450, 'character_idle');
        this.physics.add.collider(this.player, this.platforms);
    }

    update(time: number, delta: number): void {
        this.player.update();
    }
}