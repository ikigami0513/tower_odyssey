import Phaser from "phaser";
import { TutoScene } from "./scenes/tuto.scene";

let config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 300 },
            debug: false
        }
    },
    scene: TutoScene
};

let game = new Phaser.Game(config);