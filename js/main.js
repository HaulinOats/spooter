// Initialize Phaser, and create a 500px by 600px game
var game = new Phaser.Game(500, 600);

// Create our 'main' state that will contain the game
var mainState = {
    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
        game.load.image('background', 'assets/bg.png');
    },
    create: function() { 
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.
        game.add.tileSprite(0,0,500, 600, 'background');

        //create empty group
        this.pipes = game.add.group();
        this.plungers = game.add.group();

        this.gameStarted = false;

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the position x=100 and y=245
        this.turd = game.add.sprite(100, 245, 'bird');
        this.wing = this.turd.addChild(game.make.sprite(40,0, 'wing'));
        this.jumpSound = [game.add.audio('jump'), game.add.audio('jump2'), game.add.audio('jump3'), game.add.audio('jump4')];
        this.toiletSound = game.add.audio('toilet');
        this.hornSound = game.add.audio('horn');

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.turd);

        this.turd.body.gravity.y = 0;

        this.score = -1;
        this.labelScore = game.add.text(20, 20, "0", 
            { font: "30px Arial", fill: "#ffffff" }); 

        this.highScore = localStorage.getItem('highScore') || 0;

        //game title   
        this.gameTitle1 = game.add.text(200, 100, "Flappy", 
            { font: "40px Impact", fill: "#ffffff" }); 
        this.gameTitle2 = game.add.text(210, 140, "Turd", 
            { font: "40px Impact", fill: "#ffffff" }); 

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(
                       Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);  

        this.turd.anchor.setTo(-0.2, 0.5); 
        this.wing.anchor.setTo(1, 1); 
    },
    startGame:function(){

    },
    update: function() {

    },
    powerUp:function(turd, plunger){

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