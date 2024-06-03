import Phaser from "phaser";
import { Player } from "../entities/player";

export class TutoScene extends Phaser.Scene {
    player!: Player;
    sky!: Array<Phaser.GameObjects.TileSprite>;

    constructor() {
        super({ key: "TutoScene" });
    }

    create() {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        const map = this.make.tilemap({ key: "tuto_level" });
        const tileset = map.addTilesetImage('tiles', 'tiles');

        const tileSize = map.tileHeight;
        const mapHeightInTiles = map.height;

        const scale = screenHeight / (mapHeightInTiles * tileSize);

        this.sky = new Array<Phaser.GameObjects.TileSprite>();
        for (let i = 1; i < 5; i++) {
            const sky = this.add.tileSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight, `blue_sky_${i}`);
            const sky_ratio = sky.width / sky.height;
            sky.setScale(screenWidth / sky.width, screenHeight / sky.height);
            sky.setScrollFactor(0);
            this.sky.push(sky);
        }

        const groundLayer = map.createLayer('ground', tileset, 0, 0);
        groundLayer.setCollisionBetween(1, map.width);

        groundLayer.setScale(scale);

        this.player = new Player(this, 100, 450, 'character_idle');
        this.player.setScale(scale);
        this.physics.add.collider(this.player, groundLayer);
    }

    update(time: number, delta: number): void {
        this.sky.map(tileSprite => {
            tileSprite.tilePositionX += 0.2;
        })

        this.player.update();
    }
}