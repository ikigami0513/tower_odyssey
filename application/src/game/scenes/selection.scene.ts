import Phaser from "phaser";
import user from "../entities/user";
import * as settings from "../../settings";
import Label from "phaser3-rex-plugins/templates/ui/label/Label";
import { formatDate } from "../utils";
import Dialog from "phaser3-rex-plugins/templates/ui/dialog/Dialog";

interface LevelProps {
    id: string;
    name: string;
    map: string;
    by: string;
    post_date: string;
    is_official: boolean;
}

export class SelectionScene extends Phaser.Scene {
    sky!: Array<Phaser.GameObjects.TileSprite>;

    constructor() {
        super({ key: "SelectionScene" });
    }

    create() {
        this.get_levels();
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

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
    }

    async get_levels() {
        const response = await fetch(`${settings.API_BASE_URL}/api/levels/`, {
            method: "GET",
            headers: {
                Authorization: `Token ${user.token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response data:", errorData);
            throw new Error("Error while fetching levels API.");
        }

        const levels: Array<LevelProps> = await response.json();
        this.create_level_container(levels);
    }

    create_level_container(levels: Array<LevelProps>) {
        const scrollablePanel = this.rexUI.add.scrollablePanel({
            x: this.cameras.main.width / 2,
            y: this.cameras.main.height / 2,
            width: this.cameras.main.width * 0.7,
            height: this.cameras.main.height * 0.9,
            scrollMode: 'y',
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0x111827),
            panel: {
                child: this.create_level_cards(levels),
                mask: {
                    padding: 1
                }
            },
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                panel: 10
            },
            mouseWheelScroller: {
                focus: false,
                speed: 0.3
            },
        }).layout();

        // Ajouter l'interactivité aux enfants du panneau
        scrollablePanel
            .setChildrenInteractive({})
            .on('child.click', (child: any, pointer: any, event: any) => {
                if (child.data) {
                    const level = child.data.get('level');
                    if (level) {
                        user.desired_level_url = level.map;
                        this.scene.start('LevelScene');
                    }
                }
            })
            .on('child.pressstart', (child: any, pointer: any, event: any) => {
                console.log(`Press ${child.text}`);
            });

        this.add.existing(scrollablePanel);
    }

    create_level_cards(levels: Array<LevelProps>): Phaser.GameObjects.GameObject {
        const sizer = this.rexUI.add.fixWidthSizer({
            align: 'center',
            width: this.cameras.main.width * 0.6, // Adjust this width according to your requirements
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                item: 20,
                line: 20,
            }
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 10, 10, 0, 0x1F2937));

        for (let i = 0; i < levels.length; i++) {
            const card = this.create_level_card(levels[i]);
            card.setData('level', levels[i]);  // Stocker les données du niveau directement dans le card
            sizer.add(card);
        }

        return sizer;
    }

    create_level_card(level: LevelProps): Dialog {
        const dialog = new Dialog(this, {
            x: 0,
            y: 0,
            width: this.cameras.main.width * 0.6, // Ensure this matches the width used in the sizer
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),
            title: this.createLabel(level.name),
            content: this.createLabel(`Publié par ${level.by}`),
            description: this.createLabel(`Posté le ${formatDate(level.post_date)}`),
            actions: [
                this.createLabel('Jouer')
            ],
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,

                title: 25,
                content: 25,
                description: 25,
            },
            align: {
                title: 'center',
                content: 'center',
                description: 'left',
                actions: 'right',
            },
            click: {
                mode: 'release'
            }
        });

        dialog.on('button.click', function (button: Label, groupName: string, index: number, pointer: any, event: Event) {
            if (groupName === 'actions' && index === 0) {
                const level = dialog.getData('level');
                if (level) {
                    user.desired_level_url = level.map;
                    this.scene.start('LevelScene');
                }
            }
        }, this);

        return dialog;
    }

    createLabel(level_name: string): Label {
        return this.rexUI.add.label({
            width: 40,
            height: 40,
            background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),
            text: this.add.text(0, 0, level_name, { fontSize: '24px' }),
            space: { left: 10, right: 10, top: 10, bottom: 10 }
        });
    }

    update(time: number, delta: number): void {
        this.sky.forEach(tileSprite => {
            tileSprite.tilePositionX += 0.1;
        });
    }
}
