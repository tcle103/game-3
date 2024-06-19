class End extends Phaser.Scene {
    constructor() {
        super("endScene");
        this.my = { sprite: {} };  // Create an object to hold sprite bindings


    }

    init() {
        this.counter = 0;
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.bitmapFont("pixel", "font_0.png", "font.fnt");
    }

    create() {
        let my = this.my; // alias for readability

        my.sprite.sky = this.add.image(700, 600, "sky");
        my.sprite.sky.setScale(4);

        this.txt = this.add.bitmapText(550, 200, "pixel", "congrat", 100);
        this.txt.setTint(0x000000);

        this.txt3 = this.add.bitmapText(580, 450, "pixel", "> title >", 90);
        this.txt3.setTint(0x3f48cc);

        this.txt3.setInteractive();
        this.txt3.on('pointerover', () => { this.txt3.setTint(0xb83dba); });
        this.txt3.on('pointerout', () => { this.txt3.setTint(0x3f48cc); });
        this.txt3.on('pointerdown', () => 
            {
                this.scene.start("titleScene");
            })

    }

    update() {
        let my = this.my;

        ++this.counter;
        if (this.counter >= 300) {
            scene.start("titleScene");
        }

    }
}