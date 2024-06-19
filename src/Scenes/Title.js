class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
        this.my = { sprite: {} };  // Create an object to hold sprite bindings


    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("titleground", "mainground.png");

        this.load.bitmapFont("pixel", "font_0.png", "font.fnt");
    }

    create() {
        let my = this.my; // alias for readability

        my.sprite.sky = this.add.image(700, 600, "sky");
        my.sprite.sky.setScale(4);

        my.sprite.ground = this.add.sprite(720, 468, "titleground");
        my.sprite.ground.setScale(4);

        my.sprite.player = this.add.sprite(1440/2, 672, "platformer_characters", "tile_0000.png");
        my.sprite.player.setScale(4);

        this.txt = this.add.bitmapText(500, 200, "pixel", "run 'n' jump", 100);
        this.txt2 = this.add.bitmapText(480, 300, "pixel", "lvl 1. grass n sky", 70);
        this.txt3 = this.add.bitmapText(620, 450, "pixel", "> go >", 90);
        this.txt.setTint(0x000000);
        this.txt2.setTint(0x000000);
        this.txt3.setTint(0x3f48cc);

        this.txt3.setInteractive();
        this.txt3.on('pointerover', () => { this.txt3.setTint(0xb83dba); });
        this.txt3.on('pointerout', () => { this.txt3.setTint(0x3f48cc); });
        this.txt3.on('pointerdown', () => 
            {
                this.scene.start("platformerScene");
            })


    }

    update() {
        let my = this.my;

    }
}