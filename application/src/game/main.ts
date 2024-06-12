import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

// Scenes
import { LoginScene } from "./scenes/login.scene";
import { SelectionScene } from "./scenes/selection.scene";
import { PreloadScene } from "./scenes/preload.scene";
import { LevelScene } from "./scenes/level.scene";

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

declare module 'phaser' {
    interface Scene {
        rexUI: RexUIPlugin;
    }
}

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
    scene: [PreloadScene, LoginScene, SelectionScene, LevelScene],
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { x: 0, y: 350 }
        }
    },
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: RexUIPlugin,
            mapping: 'rexUI'
        }]
    }
};

function linkStart() {
    const game = new Phaser.Game(config);
}

document.addEventListener('DOMContentLoaded', function(event: Event) {
    linkStart();
});