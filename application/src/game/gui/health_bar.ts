import Phaser from "phaser";
import { Player } from "../entities/player";

export class HealthBar {
    hearts: Array<Phaser.Physics.Arcade.Sprite>;
    scene: Phaser.Scene;
    player: Player;   

    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene;
        this.player = player;
        this.hearts = new Array<Phaser.Physics.Arcade.Sprite>();
        this.setup_animations();

        for (let i = 1; i < this.player.max_health_point / 2 + 1; i++) {
            const heart = this.scene.add.sprite(35 * i, this.scene.cameras.main.height - 40, 'full_health_1') as Phaser.Physics.Arcade.Sprite;
            this.hearts.push(heart);
            heart.anims.play('full_health');
        }
    }

    update(): void {
        const fullHeartsCount = Math.floor(this.player.health_point / 2);
        const halfHeartsCount = Math.ceil(this.player.health_point / 2) - fullHeartsCount;

        // Activer les animations des cœurs pleins
        for (let i = 0; i < fullHeartsCount; i++) {
            this.hearts[i].anims.play('full_health', true);
            this.hearts[i].setVisible(true);
        }
    
        // Activer les animations des cœurs à moitié pleins
        for (let i = fullHeartsCount; i < fullHeartsCount + halfHeartsCount; i++) {
            this.hearts[i].anims.play('half_health', true);
            this.hearts[i].setVisible(true);
        }
    
        // Utiliser des cœurs vides pour les cœurs restants
        for (let i = fullHeartsCount + halfHeartsCount; i < this.hearts.length; i++) {
            this.hearts[i].setTexture('empty_health');
            this.hearts[i].setVisible(true);
        }
    }

    setup_animations(): void {
        const full_health_frames = ['full_health_1', 'full_health_2'];
        this.scene.anims.create({
            key: 'full_health',
            frames: full_health_frames.map(frame => ({ key: frame })),
            frameRate: 6,
            repeat: -1
        });

        const half_health_frames = ['half_health_1', 'half_health_2'];
        this.scene.anims.create({
            key: 'half_health',
            frames: half_health_frames.map(frame => ({ key: frame })),
            frameRate: 6,
            repeat: -1
        });

        const golden_health_frames = ['golden_health_1', 'golden_health_2'];
        this.scene.anims.create({
            key: 'golden_health',
            frames: golden_health_frames.map(frame => ({ key: frame })),
            frameRate: 6,
            repeat: -1
        });
    }
}