import Phaser from "phaser";
import { Player } from "../entities/player";
import user from "../entities/user";

export class LevelScene extends Phaser.Scene {
    player!: Player;
    level_end!: Phaser.Physics.Arcade.Sprite;
    sky!: Array<Phaser.GameObjects.TileSprite>;

    constructor() {
        super({ key: "LevelScene" });
    }

    preload() {
        this.load.tilemapTiledJSON('level_map', user.desired_level_url);
        user.desired_level_url = null;
    }

    create() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        const map = this.make.tilemap({ key: "level_map" });
        const tileset = map.addTilesetImage('tiles', 'tiles');
        const buildings_tileset = map.addTilesetImage('buildings', 'buildings');

        const tileSize = map.tileHeight;
        const mapHeightInTiles = map.height;
        const mapWidthInTiles = map.width;

        const scale = screenHeight / (mapHeightInTiles * tileSize);

        this.sky = new Array<Phaser.GameObjects.TileSprite>();
        for (let i = 1; i < 5; i++) {
            const sky_texture = this.textures.get(`sky_1_${i}`);
            const frame = sky_texture.getSourceImage();
            const sky_width = frame.width;
            const sky_height = frame.height;
            const sky = this.add.tileSprite(screenWidth / 2, screenHeight / 2, sky_width, sky_height, sky_texture);
            sky.setScale(screenWidth / sky_width, screenHeight / sky_height);
            sky.setScrollFactor(0);
            this.sky.push(sky);
        }

        const groundLayer = map.createLayer('ground', [tileset, buildings_tileset], 0, screenHeight - map.height * tileSize * scale);
        groundLayer.setCollisionBetween(1, map.width);
        groundLayer.setScale(scale);

        const backgroundLayer = map.createLayer('background', [tileset, buildings_tileset], 0, screenHeight - map.height * tileSize * scale);
        backgroundLayer.setScale(scale);

        this.player = new Player(this, 100, 450, 'character_idle_1');
        this.player.setScale(scale);
        this.physics.add.collider(this.player, groundLayer);

        const entitiesLayer = map.getObjectLayer('entities');
        if (entitiesLayer) {
            entitiesLayer.objects.forEach((object) => {
                const entity = object as Phaser.Types.Tilemaps.TiledObject;
                if (entity.name === 'player_spawn') {
                    this.player.setPosition(entity.x, entity.y);
                }
                else if (entity.name === 'level_end') {
                    this.level_end = this.physics.add.sprite(entity.x, entity.y, null)
                    .setVisible(true)
                    .setSize(entity.width, entity.height);
                }
            });
        }

        this.physics.add.collider(this.player, this.level_end, this.handleLevelEnd, undefined, this);

        // Configurer les limites de la caméra et du monde
        this.cameras.main.setBounds(0, 0, mapWidthInTiles * tileSize * scale, mapHeightInTiles * tileSize * scale);
        this.physics.world.setBounds(0, 0, mapWidthInTiles * tileSize * scale, mapHeightInTiles * tileSize * scale);
        this.cameras.main.setDeadzone(null, screenHeight);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }

    update(time: number, delta: number): void {
        this.sky.forEach(tileSprite => {
            tileSprite.tilePositionX += 0.2;
        });

        this.player.update();
    }

    handleLevelEnd(player: Player, level_end: Phaser.Physics.Arcade.Sprite) {
        console.log("level end");
    }
}
