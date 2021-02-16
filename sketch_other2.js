/* ================================================
     HCI LAB 2017 :: Whack a Mole p5.js game 
     Implemented by :: Amy Kwan 
     Supervisor :: Regan Mandryk 
================================================ */ 

// Variables for in game sprites used in the Whack-A-Mole game 
var img; // Mole's image 
var bg; // Background with sky, ground, holes 
var title;  // Title card for the game 
var front = []; // Front of the hole 
var back; // Back of the hole 
var numMoles = 9; // Number of moles created on screen 
var hammer; // Hammer image (idle)
var hammerHit; // Hammer image (hitting the mole/when clicked)

// Number of times controlling mole appearance 
var times = 2; 

// Position variables for the holes 
var holeFrontX = [0, 330, 687, 0, 316, 644, 0, 355, 690];
var holeFrontY = [212, 224, 228, 512, 500, 508, 805, 806,808]; 

// Control the mole's position of large, small and medium large mole sizes 
var moleX = [28, 380, 723,    28, 380, 723,     28, 380, 723]; 
var moleY = [230, 230, 230,   515, 515, 515,    810, 810, 810]; 

var smallX = [50, 400, 750,    50, 400, 750,    50, 400, 750]; 
var smallY = [260, 260, 260,   540, 540, 540,   840, 840, 840]; 

var medX = [40, 390, 740,    40, 390, 740,    40, 390, 740]; 
var medY = [245, 245, 245,   530, 530, 530,   830, 830, 830]; 

// Create an array of mole objects 
var myMole = []; // large size 
var smallMole = [];  // small size 
var medMole = []; // medium size 

// Mole size :: large, small, medium 
var large = 162; 
var small = 110;
var medium = 130; 

// Positions of appearance for the moles 
// var positions = [0, 7, 3, 5, 1, 4, 2, 6, 8]; <-- Initial positions 
//                  S  M  L| S  M  L| S  M  L| S  M  L| S  M  L| S  M  L
var positions = [0, 3, 4, 8, 7, 6, 2, 5, 1, 6, 3, 0, 8, 5, 2, 0, 1, 4, 7, 2];

// Current mole size variables 
// Mole sizes: 0 = Small, 1 = Medium, 2 = Large 
var whichOne = 0; 
var moleSizes = [2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 2]; 
var spawnSize = moleSizes[whichOne]; // start at location 0, which is a large mole 

// Additional mole timing variables 
var current = 0;
var moleSpawn = positions[current]; // start location at 0 

// Mole class 
function Mole (x, y, img) { 
    this.x = x; 
    this.y = y; 
    this.img = img; 
    this.hit = false; // Keep track of if the mole is whacked or not 

    this.totalMoleTime = int (random(30, 120)); 
    this.moleTime = 0; 

    //////////

    this.isOver = function() { 
       // console.log(this.x + " " + this.y + " " + mouseX + " " + mouseY + ((mouseX >= this.x && mouseX <= this.x+90 && mouseY >= this.y && mouseY <= this.y+80))); 
        return (mouseX >= this.x && mouseX <= this.x+100 && mouseY >= this.y && mouseY <= this.y+100);
    }

    this.showMole = function(sizes) { 
        // Moving up the mole above the hole 
        image(img, this.x, this.y, sizes, sizes); 
        
        for (var i = 0; i < numMoles; i ++) { 
            image(front[i], holeFrontX[i], holeFrontY[i]); 
        }
        
        this.y = this.y - 5;
        var bound = y - 110; 
        // Move up towards the upper bound of the hole 
        if (this.y <= bound) {
            this.y = bound;
        }
    }

    this.hideMole = function(sizes) { 
        // Hide the mole when mouse is pressed, in otherwords, 
        // Hide the mole when we have successfully whacked it 
        image(img, this.x, this.y, sizes, sizes); 
        
        for (var i = 0; i < numMoles; i ++) { 
            image(front[i], holeFrontX[i], holeFrontY[i]); 
        }

        this.y = this.y + 10;
        var bound = y + 20;
        // Move down the the lower bound of the hole 
        if (this.y >= bound) {
            this.y = bound;

            // Check if it reaches the bottom, then if it has been hit 
            // Otherwise, keep spawning in the same position until it has been hit 
            if (this.hit) {
                if ((moleSpawn === positions[current])) {
                    // If it has been hit, update the mole spawn index to a new position 
                    current++; 
                    moleSpawn = positions[current]; 
                    
                    // If we exceeded the last position, loop to the beginning of the array 
                    if (current > 19) {
                        current = 0;
                        moleSpawn = positions[current]; 
                    }
                }  
            }
            // Reset the timer after the mole hides for a little bit!
            if (this.moleTime >= 150){
                this.reset();
            }
        }
    }

    this.reset = function() { 
        this.totalMoleTime = int (random(30, 120)); 
        this.moleTime = 0;
    }

    this.updatePosition = function(sizes) { 
        // increment the time of the mole 
        this.moleTime++; 

        if (this.moleTime >= this.totalMoleTime) {

            this.hideMole(sizes); // Update the position within the hide function 
                /*
                if ((moleSpawn === positions[current])) {
                    current++; 
                    moleSpawn = positions[current]; 
            
                    if (current > 8) {
                        current = 0;
                        moleSpawn = positions[current]; 
                    }
                }  

                 // Reset the timer 
                this.reset(); */
        }     
    }
}

// preload() :: load all of the necessary graphical components/sprites for the game 
function preload() { 
    // Load the image of the background, with an 900x900 canvas size 
    bg = loadImage("assets/wambg2.png"); 

    // load the image of the mole
    img = loadImage("assets/molecpy1.png"); 

    // Back of the hole to hide the mole 
    back = loadImage("assets/back.png");    
    // Front of the hole to hide the mole 
    for (var i = 0; i < numMoles; i++) { 
        front[i] = loadImage("assets/frontcpy" + i + ".png"); 
    }

    // Load the hammer images 
    hammer = loadImage("assets/hammer.png"); 
    hammerHit = loadImage("assets/hammer2.png");
}

// setup() :: runs once, to set up the canvas used for the Whack a Mole Game 
function setup() {
    // Load all necessary graphics 
    // Create the canvas size for the gaming interface 
    createCanvas(900, 900);

    // Create and initialize 9 new moles of each size 
    for (var i = 0; i < numMoles; i++){
        myMole.push(new Mole(moleX[i], moleY[i], img));
    }

    for (var i = 0; i < numMoles; i++){
        smallMole.push(new Mole(smallX[i], smallY[i], img));
    }

    for (var i = 0; i < numMoles; i++){
        medMole.push(new Mole(medX[i], medY[i], img));
    }
}

// draw() :: animation function, displaying the visual components of the game 
function draw() {
    // Load title card 
    // background(title);

    // Fill the background of the whack a mole game 
    image(bg, 0, 0, 900, 900); 
    
    // Show and hide the moles 
    //updateSize();
    playGame();

    // Display the hammer images to indicate whacking the mole 
    displayHammer();
}

function next() { 
    whichOne++; 
    spawnSize = moleSizes[whichOne];

    if (whichOne > 19) { 
        whichOne = 0; 
        spawnSize = moleSizes[whichOne];
    }
}

// playGame() :: play the game, show and hide the moles 
function playGame() { 
     // Show all of the 9 moles and update their position, according to their mole spawn index 
    if (spawnSize == 0) { 
         smallMole[moleSpawn].showMole(small);
         smallMole[moleSpawn].updatePosition(small);

        if (smallMole[moleSpawn].hit) { 
            smallMole[moleSpawn].hideMole(small); 
            //next(); 
        }
    } else if (spawnSize == 1) { 
        medMole[moleSpawn].showMole(medium);         
        medMole[moleSpawn].updatePosition(medium);

        if (medMole[moleSpawn].hit) { 
            medMole[moleSpawn].hideMole(medium); 
           //next(); 
        }
    } else if (spawnSize == 2) { 
        myMole[moleSpawn].showMole(large);         
        myMole[moleSpawn].updatePosition(large);

        if (myMole[moleSpawn].hit) { 
            myMole[moleSpawn].hideMole(large); 
           //next();
        }
    }
   
    /*
    myMole[moleSpawn].showMole(large);         
    myMole[moleSpawn].updatePosition(large);

    if (myMole[moleSpawn].hit) { 
        myMole[moleSpawn].hideMole(large); 
    } 

    smallMole[moleSpawn].showMole(small);         
    smallMole[moleSpawn].updatePosition(small);

    if (smallMole[moleSpawn].hit) { 
        smallMole[moleSpawn].hideMole(small); 
    }

    medMole[moleSpawn].showMole(medium);         
    medMole[moleSpawn].updatePosition(medium);

    if (medMole[moleSpawn].hit) { 
        medMole[moleSpawn].hideMole(medium); 
    }
    */

}

// displayHammer() :: Display the hammer as the cursor, changes depending if a mole is hit or not 
function displayHammer() { 
    // If the mouse is pressed/mole is hit, change the hammer 
    if (mouseIsPressed) {
        image(hammerHit, mouseX-30, mouseY-50, 100, 100);
    } else { 
        image(hammer, mouseX-30, mouseY-50, 100, 100); 
    }
}

// mousePressed() :: Set the hit variable of the mole accordingly if the mouse is over the mole 
function mousePressed() {
    // console.log("mouseX: " + mouseX);
    // console.log("mouseY: " + mouseY);

    for (var i = 0; i < numMoles; i++) {
        if (myMole[i].isOver()) {
            myMole[i].hit = true; 
        } else {
            myMole[i].hit = false; 
        }
    }

    for (var i = 0; i < numMoles; i++) {
        if (smallMole[i].isOver()) {
            smallMole[i].hit = true; 
        } else {
            smallMole[i].hit = false; 
        }
    }

    for (var i = 0; i < numMoles; i++) {
        if (medMole[i].isOver()) {
            medMole[i].hit = true; 
        } else {
            medMole[i].hit = false; 
        }
    }
}
