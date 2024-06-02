import Phaser from "phaser";
import { TutoScene } from "./scenes/tuto.scene";

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    scene: [TutoScene],
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 300 }
        }
    }
};

window.addEventListener('load', () => {
    const game = new Phaser.Game(config);
});