// this and other code helping with fall thru/pass thru platforms from here:
// https://cedarcantab.wixsite.com/website-1/post/one-way-pass-through-platforms-in-phaser-3-sprites
function onPlatform(scene, platform) {
    scene.isOnPlatform = true;
    scene.onPlatform = platform;
}

class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 210;
        this.DRAG = 800;    // DRAG < ACCELERATION = icy slide
        this.MAXSPEED = 500;
        this.physics.world.gravity.y = 2000;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 100;
        this.SCALE = 4.5;
        this.health = 3;
        this.counter = 300;
        this.counter1 = 0;
        this.flash = false;
        this.flashing = false;
        this.isOnPlatform = false;
        this.onPlatform = null;
    }

    create() {
        my.sprite.sky = this.add.image(700, 350, "sky");

        this.anims.create({
            key: "health",
            frames: [
                { key: "heart" },
                { key: "heart1" },
            ],
            frameRate: 30
        });


        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("map", 18, 18, 50, 20);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("pixel-platformer", "tilemap_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("ground", this.tileset, 0, 0);
        this.platformLayer = this.map.createLayer("platforms", this.tileset, 0, 0);


        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // this and other code helping with fall thru/pass thru platforms from here:
        // https://cedarcantab.wixsite.com/website-1/post/one-way-pass-through-platforms-in-phaser-3-sprites
        this.platformLayer.forEachTile(tile => {
            if (tile.properties["oneWay"]) {
                tile.setCollision(false, false, true, false);
            }
        })

        // TODO: Add createFromObjects here

        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.coins = this.map.createFromObjects("objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

        // TODO: Add turn into Arcade Physics here

        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);

        // set up player avatar
        this.start = this.map.createFromObjects("objects", {
            name: "start",
        })[0];
        this.start.visible = false;
        
        this.end = this.map.createFromObjects("objects", {
            name: "end"
        });
        this.physics.world.enable(this.end, Phaser.Physics.Arcade.STATIC_BODY);
        this.endGroup = this.add.group(this.end);

        my.sprite.player = this.physics.add.sprite(this.start.x, this.start.y, "platformer_characters", "tile_0000.png");
        my.sprite.player.body.maxSpeed = this.MAXSPEED;
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // this and other code helping with fall thru/pass thru platforms from here:
        // https://cedarcantab.wixsite.com/website-1/post/one-way-pass-through-platforms-in-phaser-3-sprites
        this.physics.add.collider(my.sprite.player, this.platformLayer, (player, platform) => {
            onPlatform(this, platform);
            //console.log(platform);
        });

        this.water1 = this.map.createFromObjects("objects", {
            name: "water",
            key: "tilemap_sheet",
            frame: 33
        });
        this.physics.world.enable(this.water1, Phaser.Physics.Arcade.STATIC_BODY);
        this.damageables = this.add.group(this.water1);

        this.water = this.map.createLayer("damageables", this.tileset, 0, 0);

        // TODO: Add coin collision handler

        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.coinAudio.play();
            this.coins.pop();
            console.log(this.coins.length);
            obj2.destroy(); // remove coin on overlap
        });

        this.physics.add.overlap(my.sprite.player, this.damageables, (obj1, obj2) => {
            if (this.counter >= 150) {
                this.flashing = true;
                this.counter = 0;
                --this.health;
                my.sprite.hearts[this.health].play("health");
                console.log(this.health);
                my.sprite.player.body.setVelocityY(-400);
            }
        });

        this.physics.add.overlap(my.sprite.player, this.endGroup, (obj1, obj2) => {
            //console.log("hello");
            if (this.coins.length <= 0) {
                this.scene.start("endScene");
            }
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // movement vfx
        let texture = this.textures.get("particle");
        texture.add("particle1", 0, 0, 0, 5, 5);
        texture.add("particle2", 0, 5, 0, 5, 5);
        texture.add("particle3", 0, 10, 0, 5, 5);
        console.log(this.textures.get("particle"));

        texture = this.textures.get("particle2");
        texture.add("particle1", 0, 0, 0, 5, 5);
        texture.add("particle2", 0, 5, 0, 5, 5);
        texture.add("particle3", 0, 10, 0, 5, 5);
        console.log(this.textures.get("particle").getFrameNames());

        my.vfx.jump = this.add.particles(0, 0, "particle", {
            frame: ['particle1', 'particle2', 'particle3'],
            // TODO: Try: add random: true
            //random: true,
            scale: {start: 1, end: 2},
            // TODO: Try: maxAliveParticles: 8,
            // maxAliveParticles: 8,
            lifespan: 400,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}
        });

        my.vfx.walking = this.add.particles(0, 0, "particle2", {
            frame: ['particle1', 'particle2', 'particle3'],
            // TODO: Try: add random: true
            //random: true,
            scale: {start: 1, end: 2},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 30,
            lifespan: 300,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}
        });

        my.vfx.jump.stop();
        my.vfx.walking.stop();

        my.sprite.hearts = [];
        my.sprite.hearts.push(this.add.sprite(575, 365, "heart"));
        my.sprite.hearts.push(this.add.sprite(590, 365, "heart"));
        my.sprite.hearts.push(this.add.sprite(605, 365, "heart"));
        console.log(my.sprite.hearts[0]);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
        my.sprite.sky.setScrollFactor(0, 0.5);
        my.sprite.hearts[0].setScrollFactor(0);
        my.sprite.hearts[1].setScrollFactor(0);
        my.sprite.hearts[2].setScrollFactor(0);

        this.physics.world.setBounds(0,0,this.map.widthInPixels, 600);

        this.jumpAudio = this.sound.add("jump", { volume: 0.2 });
        this.coinAudio = this.sound.add("coin", { volume: 0.2 });
    }



    update() {
        ++this.counter;
        ++this.counter1;
        if (this.flashing) {
            if (this.counter1 >= 15) {
                if (this.flash) {
                    my.sprite.player.clearTint();
                    this.flash = false;
                    this.counter1 = 0;
                }
                else {
                    my.sprite.player.setTint(0xff0000);
                    this.flash = true;
                    this.counter1 = 0;
                }
            }
            if (this.counter >= 150) {
                this.flashing = false;
                my.sprite.player.clearTint();
            }
        }
        if (my.sprite.player.y >= (this.map.heightInPixels)) {
            if (my.sprite.player.y >= 500) {
                this.scene.start("titleScene");
            }
        }
        if (this.health <= 0) {
            my.sprite.player.body.checkCollision.down = false;
        }
        if (cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-2, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY/3, 0);

            //Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
                my.vfx.jump.stop();

            }

        } else if (cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-2, false);

            my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY/3, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
                my.vfx.jump.stop();

            }

        } else if (cursors.down.isDown) {
            // this and other code helping with fall thru/pass thru platforms from here:
            // https://cedarcantab.wixsite.com/website-1/post/one-way-pass-through-platforms-in-phaser-3-sprites
            if (this.onPlatform) {
                this.onPlatform.collideUp = false;
            }
        }
        else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // TODO: have the vfx stop playing

            my.vfx.walking.stop();
            my.vfx.jump.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if (!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            my.vfx.walking.stop();

        }
        if (my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            // this and other code helping with fall thru/pass thru platforms from here:
            // https://cedarcantab.wixsite.com/website-1/post/one-way-pass-through-platforms-in-phaser-3-sprites

            my.vfx.jump.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.jump.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.jump.start();

            this.jumpAudio.play();


            if (this.isOnPlatform) {
                this.onPlatform.collideUp = true;
                this.isOnPlatform = false;
                this.onPlatform = null;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}