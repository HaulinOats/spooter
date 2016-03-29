//If orientation changes or window resizes, reload page/game
window.addEventListener("resize", function() {
    clearTimeout(resizeTimeout);
    var resizeTimeout = setTimeout(function(){
        location.reload();
    }, 500)
}, false);

// Initialize Phaser, and create a 500px by 600px game
if (window.innerHeight < window.innerWidth)
    alert("Only usable in Portrait mode!");
else {
    var gameWidth = window.innerWidth,
        gameHeight = window.innerHeight,
        shipWidth = 64,
        enemy1Width = 64,
        game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'gameBody', null, true);

    // Create our 'main' state that will contain the game
    var mainState = {
        preload: function() { 
            // This function will be executed at the beginning     
            // That's where we load the images and sounds 
            game.load.image('ship', 'img/ship.png');
            game.load.image('enemy1', 'img/enemy1.png');
            game.load.image('shipLaser', 'img/shipLaser.png');
        },
        create: function() {
            //set physics
            game.physics.startSystem(Phaser.Physics.ARCADE);
            
            //create ship and enable
            this.ship = game.add.sprite((gameWidth/2) - shipWidth/2, gameHeight - 100, 'ship');
            game.physics.arcade.enable(this.ship);
            
            //create ship's lasers and enable
            this.shipLasers = game.add.group();
            this.laserDelayTime = 10;
            this.laserDelayVal  = 0;
            this.shipLasers.enableBody = true;
            this.shipLasers.physicsBodyType = Phaser.Physics.ARCADE;
            this.shipLasers.createMultiple(20, 'shipLaser');
            this.shipLasers.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetLaser);
            this.shipLasers.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
            this.shipLasers.setAll('checkWorldBounds', true);

            //create enemies
            this.enemies = game.add.group();
            this.enemies.enableBody = true;
            this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
            this.enemies.createMultiple(10, 'enemy1', 0, true);
            var xPosition = {
                "row1":enemy1Width,
                "row2":enemy1Width
            };
            for (var i = 0; i < this.enemies.children.length; i++){
                if (this.enemies.children.length/2 > i) {
                    this.enemies.children[i].y = gameHeight/7;
                    this.enemies.children[i].x = xPosition.row1;
                    xPosition.row1 += enemy1Width + 15;
                } else {
                    this.enemies.children[i].y = gameHeight/4;
                    this.enemies.children[i].x = xPosition.row2;
                    xPosition.row2 += enemy1Width + 15;
                }
                this.enemies.children[i].body.velocity.x = -20;
                this.enemies.children[i].body.collideWorldBounds = true;
                this.enemies.children[i].body.bounce.setTo(1,1);
            }

            //Score Tracker
            this.score = 0;
            this.labelScore = game.add.text(20, 20, "0", 
                { font: "30px Impact", fill: "#ffffff" });

            this.highScore = localStorage.getItem('highScore') || 0;
        },
        moveBack:function(){
            console.log('out of bounds');
        },
        update: function() {
            //move ship to pointer (finger or mouse)
            game.input.addMoveCallback(this.moveShipTo, this);
            
            //Fire lasers as long as pressed based on delay
            if (game.input.activePointer.isDown && this.laserDelayVal > this.laserDelayTime) {
                this.fireLaser();
                this.laserDelayVal = 0;
            } else
                this.laserDelayVal++;

            //check if player runs into an enemy
            game.physics.arcade.overlap(
                this.ship, this.enemies, this.shipCollision, null, this);

            //check if laser hits an enemy
            game.physics.arcade.overlap(
                this.shipLasers, this.enemies, this.enemyHit, null, this);

        },
        enemyHit:function(laser, enemy){
            console.log('laser hit an enemy');
            enemy.kill();
            laser.kill();
        },
        shipCollision:function(){
            console.log('ship collision');
            // Go through all the pipes, and stop their movement
            this.enemies.forEach(function(p){
                p.body.velocity.x = 0;
            }, this);
        },
        moveShipTo:function(){
            // if (game.input.activePointer.y > gameHeight/1.5) {
                this.ship.x = game.input.activePointer.x - (shipWidth/2);
                this.ship.y = game.input.activePointer.y - (shipWidth/2);
            // }
        },
        resetLaser:function(laser){
            laser.kill();
        },
        fireLaser:function() {
            // Get the first laser that's inactive, by passing 'false' as a parameter
            var laser = this.shipLasers.getFirstExists(false);
            if (laser) {
                // If we have a laser, set it to the starting position
                laser.reset(this.ship.x + (shipWidth/2), this.ship.y);
                // Give it a velocity of -500 so it starts shooting
                laser.body.velocity.y = -500;
            }
         
        },
        powerUp:function(){

        },
        endGame: function() {

        },
        restartGame:function(){
            game.state.start('main');
        }
    };

    // Add and start the 'main' state to start the game
    game.state.add('main', mainState);
    game.state.start('main');
}