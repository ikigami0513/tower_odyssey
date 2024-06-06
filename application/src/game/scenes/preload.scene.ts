import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image('sky_1_1', 'assets/background/sky_1/1.png');
        this.load.image('sky_1_2', 'assets/background/sky_1/2.png');
        this.load.image('sky_1_3', 'assets/background/sky_1/3.png');
        this.load.image('sky_1_4', 'assets/background/sky_1/4.png');

        this.load.image('empty_health', 'assets/hud/health/empty.png');
        this.load.image('half_health_1', 'assets/hud/health/half_1.png');
        this.load.image('half_health_2', 'assets/hud/health/half_2.png');
        this.load.image('full_health_1', 'assets/hud/health/full_1.png');
        this.load.image('full_health_2', 'assets/hud/health/full_2.png');
        this.load.image('golden_health_1', 'assets/hud/health/golden_1.png');
        this.load.image('golden_health_2', 'assets/hud/health/golden_2.png');

        for (let i = 1; i < 5; i++) {
            this.load.image(`character_idle_${i}`, `assets/character/idle/${i}.png`);
        }

        for (let i = 1; i < 9; i++) {
            this.load.image(`character_run_${i}`, `assets/character/run/${i}.png`);
        }

        for (let i = 1; i < 9; i++) {
            this.load.image(`character_dead_${i}`, `assets/character/dead/${i}.png`);
        }

        for (let i = 1; i < 9; i++) {
            this.load.image(`character_attack_${i}`, `assets/character/attack/${i}.png`);
        }

        for (let i = 1; i < 16; i++) {
            this.load.image(`character_jump_${i}`, `assets/character/jump/${i}.png`);
        }

        this.load.tilemapTiledJSON('tuto_level', 'assets/map/tuto_level.tmj');
        this.load.image('tiles', 'assets/tiles/Tiles.png');
    }

    create() {
        this.scene.start("TutoScene");
    }
}