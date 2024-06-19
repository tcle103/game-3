class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "kenney_pixel-platformer/Tilemap/tilemap_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("map", "map.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "kenney_pixel-platformer/Tilemap/tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.image("sky", "sky.png");
        this.load.image("heart", "kenney_pixel-platformer/Tiles/tile_0044.png");
        this.load.image("heart1", "kenney_pixel-platformer/Tiles/tile_0046.png");

        this.load.image("particle", "particle.png"); 
        let texture = this.textures.get("particle");
        texture.add("particle1", 0, 0, 0, 5, 5);
        texture.add("particle2", 0, 5, 0, 5, 5);
        texture.add("particle3", 0, 10, 0, 5, 5);
        console.log(this.textures.get("particle").getFrameNames());

        this.load.image("particle2", "particle2.png");

        this.load.audio("jump", ["/kenney_digital-audio/Audio/phaseJump1.ogg"]);
        this.load.audio("coin", ["/kenney_digital-audio/Audio/powerUp6.ogg"]);
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("titleScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}