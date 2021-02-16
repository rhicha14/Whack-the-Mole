/* ================================================
     HCI LAB 2017 :: Whack a Mole p5.js game 
     Implemented by :: Amy Kwan 
     Supervisor :: Regan Mandryk 
================================================ */ 

// Variables for in game sprites used in the Whack-A-Mole game 
var img; // Mole's image 
var bg; // Background with sky, ground, holes 
var hole; // Image of the full hole 
var title;  // Title card for the game 
var front = []; // Front of the hole 
var numMoles = 9; // Number of moles created on screen 
var hammer; // Hammer image (idle)
var hammerHit; // Hammer image (hitting the mole/when clicked)

// Position offset for the moles of all sizes 
/*
var largeX = 106;
var largeY = 66; 
var smallX = 26.5; 
var smallY = 16.5; 
var medX = 53; 
var medY = 33; 
*/
var largeX = -37; 
var largeY = 130;

// Proper locations, and height/width of game canvas
var wid = 1200; 
var hei = 900; 
var locations = []; 

// Number of times controlling mole appearance 
var times = 2; 

// Position variables for the holes 
var holeFrontX = [-2, 400, 713, -2, 410, 727, -1, 392, 745];
var holeFrontY = [197, 224, 225, 443, 441, 437, 668, 675, 660]; 

// Create an array of mole objects 
var myMole = [];  

// Mole size :: large, small, medium 
var large = 210; 
var small = 52.5;
var medium = 105; 

// Positions of appearance for the moles 
//                 S  M  L| S  M  L| S  M  L| S  M  L| S  M  L| S  M  L
var positions = [0, 3, 4, 8, 7, 6, 2, 5, 1, 6, 3, 0, 8, 5, 2, 0, 1, 4, 7, 2]; // <-- Initial positions 
// var positions = [0, 3, 5, 6, 7, 1, 8, 5, 3, 2, 1, 7, 0, 1, 7, 2, 5, 3, 8, 4, 6, 4, 2, 1, 7]; 

// Current mole size variables 
// Mole sizes: 0 = Small, 1 = Medium, 2 = Large 
var whichOne = 0; 
var moleSizes = [2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 2]; // <-- Initial sizes 
// var moleSizes = [2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 2, 0];
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
    // this.size = large; 
    // this.position; 
    this.totalMoleTime = int (random(30, 120)); 
    this.moleTime = 0; 

    this.graphics = createGraphics(130,170);
    //this.graphics = createGraphics(500,500);
    this.gx = x; 
    this.gy = y; 

    //////////

    this.isOver = function() { 
       if (spawnSize == 2) { 
           return (mouseX >= (this.x-largeX) && mouseX <= (this.x-largeX)+100 && mouseY >= (this.y-largeY) && mouseY <= (this.y-largeY)+100);
       } else if (spawnSize == 0) { 
           return (mouseX >= (this.x-smallX) && mouseX <= (this.x-smallX)+100 && mouseY >= (this.y-smallY) && mouseY <= (this.y-smallY)+100);
       } else if (spawnSize == 1) { 
           return (mouseX >= (this.x-medX) && mouseX <= (this.x-medX)+100 && mouseY >= (this.y-medY) && mouseY <= (this.y-medY) + 100);
       }
    }

    this.showMole = function() { 
        // Moving up the mole above the hole, depending on the sizes, display it 
        /*
        if (spawnSize == 0) { 
            image(img, this.x-smallX, this.y-smallY, small, small);
        } else if (spawnSize == 1) { 
            image(img, this.x-medX, this.y-medY, medium, medium);
        } else if (spawnSize == 2) { 
            image(img, this.x-largeX, this.y-largeY, large, large); 
        }*/

        this.graphics.clear(); 
        //this.graphics.background(155);

        if (spawnSize == 0) { 
            this.graphics.image(img, this.x-smallX, this.y-smallY, small, small);
        } else if (spawnSize == 1) { 
            this.graphics.image(img, this.x-medX, this.y-medY, medium, medium);
        } else if (spawnSize == 2) { 
            this.graphics.image(img, largeX, this.y-largeY, large, large); 
        } 
 
        //image(img, this.x, this.y, this.size, this.size); 
        /*
        for (var i = 0; i < numMoles; i ++) { 
            image(front[i], holeFrontX[i], holeFrontY[i]); 
        }*/

        // Animation Speed 
        this.y = this.y - 5;

        // Change the bound of showing the mole depending on size 
        var bound; 
        if (spawnSize == 0) { // Small mole bound 
            bound = y - 20; 
        } else if (spawnSize == 2) { // Large mole bound 
            bound = y - 80;
        } else if (spawnSize == 1) { // Medium mole bound 
            bound = y - 40;
        }
        // var bound = y - 90; // <-- Original Initial bounding 

        // Move up towards the upper bound of the hole 
        if (this.y <= bound) {
            this.y = bound;
        }
    }

    this.hideMole = function() { 
        // Hide the mole when mouse is pressed, in otherwords, Hide the mole when we have successfully whacked it 
        if (spawnSize == 0) { 
            image(img, this.x-smallX, this.y-smallY, small, small);
        } else if (spawnSize == 1) { 
            image(img, this.x-medX, this.y-medY, medium, medium);
        } else if (spawnSize == 2) { 
            image(img, this.x-largeX, this.y-largeY, large, large); 
        }
        /*
        if (spawnSize == 0) { 
            this.graphics.image(img, this.x-smallX, this.y-smallY, small, small);
        } else if (spawnSize == 1) { 
            this.graphics.image(img, this.x-medX, this.y-medY, medium, medium);
        } else if (spawnSize == 2) { 
            this.graphics.image(img, -37, 0, large, large); 
        }*/

        // image(img, this.x, this.y, this.size, this.size); 
        /*
        for (var i = 0; i < numMoles; i ++) { 
            image(front[i], holeFrontX[i], holeFrontY[i]); 
        }*/

        this.y = this.y + 10;
        var bound = y + 52;
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
                    this.next(); // Update the size only if it's been hit/advancing to next hole 
                    // you can add 1 to the count of whatever count you are supposed to add to right here
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

    this.next = function() { 
        // NOTE:    whichOne = (whichOne + 1) % 20    //  1 %20 = 1, 2%20 = 2, ..., 20 % 20 = 0 , 21 % 20
        whichOne++; // Update the size index 
        spawnSize = moleSizes[whichOne];

        if (whichOne > 19) { 
            whichOne = 0; 
            spawnSize = moleSizes[whichOne];
        }
    }

    this.updatePosition = function() { 
        // increment the time of the mole 
        this.moleTime++; 

        if (this.moleTime >= this.totalMoleTime) {

            this.hideMole(); // Update the position within the hide function 
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

    // EXTRA FUNCTION: MAYBE IMPLEMENT 
    this.respawn = function() { 
       // this.size = next; 
       // this.position = next; 
    }
}

// preload() :: load all of the necessary graphical components/sprites for the game 
function preload() { 
    // Load the holes
    hole = loadImage("assets/hole_copy2.png");

    // Load the image of the background, on the canvas
    bg = loadImage("assets/newbg.png"); 

    // load the image of the mole
    img = loadImage("assets/molecpy2.png"); 
    
    // Front of the hole to hide the mole 
    for (var i = 0; i < numMoles; i++) { 
        front[i] = loadImage("assets/f" + i + ".png"); 
    }

    // Load the hammer images 
    hammer = loadImage("assets/hammer.png"); 
    hammerHit = loadImage("assets/hammer2.png");
}

// setup() :: runs once, to set up the canvas used for the Whack a Mole Game 
function setup() {
    // Create the canvas size for the gaming interface 
    createCanvas(wid, hei);

    // Line up the hole locations as necessary 
    locations = [ { x:(wid/4), y: hei/4 }, { x:wid/4, y: hei/2 }, { x:wid/4, y: hei*0.75}, 
	{ x:wid/2, y:hei/4 }, { x:wid/2, y:hei/2}, { x:wid/2, y:hei*0.75 },
    { x:wid*0.75, y:hei/4}, { x:wid*0.75, y:hei/2 }, { x:wid*0.75, y:hei*0.75} ];
    
    // Create and initialize 9 new moles of each size
    for (var i = 0; i < numMoles; i++){
       myMole.push(new Mole(locations[i].x, locations[i].y, img));
    }
}

// draw() :: animation function, displaying the visual components of the game 
function draw() {
    // Fill the background of the whack a mole game 
    image(bg, 0, 0, wid, hei); 
  
    // New Holes location 
    loadHoles(); 

    // Show and hide the moles 
    playGame();

    // Display the hammer images to indicate whacking the mole 
    displayHammer();
}

// loadHoles() :: load the correct positions of all holes 
function loadHoles() { 
    for (var i = 0; i < numMoles; i ++) {
        image(hole, locations[i].x-80, locations[i].y-20, 162, 64);
    }
}

// playGame() :: play the game, show and hide the moles 
function playGame() { 
    // Show all of the 9 moles and update their position, according to their mole spawn index
    myMole[moleSpawn].showMole();        
    myMole[moleSpawn].updatePosition();

   // if (myMole[moleSpawn].hit) { 
    //    myMole[moleSpawn].hideMole(); 
   // }
    
    // Control the buffer position 
    if (spawnSize == 0) { 
        image(myMole[moleSpawn].graphics, myMole[moleSpawn].gx-smallX, myMole[moleSpawn].gy-smallY);
    } else if (spawnSize == 1) { 
        image(myMole[moleSpawn].graphics, myMole[moleSpawn].gx-medX, myMole[moleSpawn].gy-medY);
    } else if (spawnSize == 2) { 
        image(myMole[moleSpawn].graphics, myMole[moleSpawn].gx-68, myMole[moleSpawn].gy-155);
    }
      
}

// displayHammer() :: Display the hammer as the cursor, changes depending if a mole is hit or not 
function displayHammer() { 
    // If the mouse is pressed/mole is hit, change the hammer 
    if (mouseIsPressed) {
        image(hammerHit, mouseX-15, mouseY-50, 100, 100);
    } else { 
        image(hammer, mouseX-15, mouseY-50, 100, 100); 
    }
}

// mousePressed() :: Set the hit variable of the mole accordingly if the mouse is over the mole 
function mousePressed() {
   // console.log("mouseX: " + mouseX);
   // console.log("mouseY: " + mouseY);

    for (var i = 0; i < numMoles; i++) {
        // console.log(myMole[i].isOver());
        if (myMole[i].isOver()) {
            myMole[i].hit = true; 
        } else {
            myMole[i].hit = false; 
        }
    }
}
