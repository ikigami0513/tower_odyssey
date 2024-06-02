import Phaser from "phaser";
import { Player } from "../entities/player";

export class TutoScene extends Phaser.Scene {
    platforms!: Phaser.Physics.Arcade.StaticGroup;
    player!: Player;

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');

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
            'assets/character/attack/attack.png',
            { frameWidth: 96, frameHeight: 80 }
        );
        this.load.spritesheet('character_end_jump',
            'assets/character/jump_end/jump_end_sheet.png',
            { frameWidth: 64, frameHeight: 64 }
        );
    }

    create() {
        this.add.image(400, 300, 'sky');

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