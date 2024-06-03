import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image('blue_sky_1', 'assets/background/blue_sky/blue_sky_1.png');
        this.load.image('blue_sky_2', 'assets/background/blue_sky/blue_sky_2.png');
        this.load.image('blue_sky_3', 'assets/background/blue_sky/blue_sky_3.png');
        this.load.image('blue_sky_4', 'assets/background/blue_sky/blue_sky_4.png');

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

        this.load.tilemapTiledJSON('tuto_level', 'assets/map/tuto_level.tmj');
        this.load.image('tiles', 'assets/tiles/Tiles.png');
    }

    create() {
        this.scene.start("TutoScene");
    }
}