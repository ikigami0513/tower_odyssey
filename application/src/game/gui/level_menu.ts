import Phaser from "phaser";
import Dialog from "phaser3-rex-plugins/templates/ui/dialog/Dialog";
import Label from "phaser3-rex-plugins/templates/ui/label/Label";
import { Player } from "../entities/player";

class QuitConfirmDialog {
    level_menu: LevelMenu;
    dialog: Dialog;
    
    constructor(level_menu: LevelMenu) {
        this.level_menu = level_menu;
        this.dialog = this.level_menu.scene.rexUI.add.dialog({
            x: this.level_menu.scene.cameras.main.width / 2,
            y: this.level_menu.scene.cameras.main.height / 2,
            width: this.level_menu.scene.cameras.main.width * 0.5,
            height: this.level_menu.scene.cameras.main.height * 0.2,
            background: this.level_menu.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x111827).setAlpha(0.6),
            title: this.level_menu.scene.rexUI.add.label({
                background: this.level_menu.scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),
                text: this.level_menu.scene.add.text(0, 0, 'Quitter ?', {
                    fontSize: '24px'
                }),
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),
            actions: [
                this.level_menu.createLabel('Oui'),
                this.level_menu.createLabel('Non')
            ],
            space: {
                title: 25,
                content: 25,
                action: 15,

                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },
            align: {
                actions: 'right'
            },
            expand: {
                content: false
            }
        })
        .layout()
        .popUp(1000);

        this.dialog.on('button.click', (button: Label, groupName: string, index: number) => {
            if (groupName === 'actions') {
                if (index === 0) { // Oui
                    this.level_menu.scene.time.paused = false;
                    this.level_menu.scene.physics.world.resume();
                    this.level_menu.scene.scene.start('SelectionScene');
                }
                else if (index === 1) { // Non
                    this.dialog.setVisible(false);
                    this.level_menu.menu.setVisible(true);
                }
            }
        });

        this.dialog.setVisible(false);
        this.dialog.setScrollFactor(0);
    }
}

export class LevelMenu {
    scene: Phaser.Scene;
    menu: Dialog;
    player: Player;
    quit_confirm_dialog: QuitConfirmDialog;

    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene;
        this.player = player;
        this.quit_confirm_dialog = new QuitConfirmDialog(this);
        this.menu = this.scene.rexUI.add.dialog({
            x: this.scene.cameras.main.width / 2,
            y: this.scene.cameras.main.height / 2,
            width: this.scene.cameras.main.width * 0.8,
            height: this.scene.cameras.main.height * 0.5,
            background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x111827).setAlpha(0.6),
            title: this.createLabel('Menu'),
            choices: [
                this.createLabel('Reprendre'),
                this.createLabel('Quitter')
            ],
            space: {
                left: 20,
                right: 20,
                top: -20,
                bottom: -20,

                title: 25,
                titleLeft: 30,
                choices: 25,
                choice: 15
            },
            expand: {
                title: false
            },
            align: {
                title: 'center'
            },
            click: {
                mode: 'release'
            }
        })
        .layout()
        .popUp(1000);

        this.menu.on('button.click', (button: Label, groupName: string, index: number, pointer: any, event: any) => {
            if (groupName === 'choices') {
                if (index === 0) { // Reprendre
                    this.player.resume();
                }
                else if (index === 1) { // Quitter
                    this.menu.setVisible(false);
                    this.quit_confirm_dialog.dialog.setVisible(true);
                }
            }
        });
        
        this.menu.setVisible(false);
        this.menu.setScrollFactor(0);
    }

    createLabel(text: string): Phaser.GameObjects.GameObject {
        return this.scene.rexUI.add.label({
            width: 40,
            height: 40,
            background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),
            text: this.scene.add.text(0, 0, text, { fontSize: '24px' }),
            space: { left: 10, right: 10, top: 10, bottom: 10 }
        });
    }
}
