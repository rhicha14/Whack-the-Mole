var welcomeState = 0; 
var gameState = 1; 
var programState = welcomeState;
var title; 
var startUnpressed; 
var startPressed; 
var menuUnpressed; 
var menuPressed; 
var instructions; 
var insFont; 

var img; 
var bg; 
var hole;  
var numMoles = 9; 
var hammer; 
var hammerHit;

var largeX = 100;
var largeY = 50; 
var smallX = 80;
var smallY = 20; 
var medX = 70; 
var medY = 20; 

var wid = 1200; 
var hei = 900; 
var locations = []; 


var myMole = [];  

var large = 210; 
var small = 52.5;
var medium = 105; 

var positions = [0, 3, 5, 6, 7, 1, 8, 5, 3, 2, 1, 7, 0, 1, 7, 2, 5, 3, 8, 6, 4, 2, 1, 7, 0, 6, 1, 8]; 

var current = 0;
var moleSpawn = positions[current];  


var whichOne = 0; 
var moleSizes = [2, 0, 1, 2, 1, 0, 1, 2, 2, 0, 1, 2, 0, 1, 2, 2, 0, 1, 0, 1, 2, 0, 1, 0, 2, 1, 2, 2]; 
var spawnSize = moleSizes[whichOne]; 


var timeStamp = ""; 


var targetX; 
var targetY; 
var sizeOfMole; 
var clickedOnFirstTry = false;
var clickOnce = 0; 
var distance; 

var active = false; 
var timeShown = 0; 
var stopTime = 0; 
var timeFromShownToMouseDown = 0; 


var prevSpawnIndex = positions[current]; 
var curSpawnIndex = positions[current]; 


var curHole = current + 1; 
var nextHoleIndex = positions[curHole]; 

var nextSize = whichOne + 1; 
var nextMoleSize = moleSizes[nextSize]; 


var pressedX;
var pressedY;


var didTheMoleHideFirst = false; 

var score = 0; 

var timeWhenGameStarts = 0; 
var progStartTime = 0; 

var timeTheCount = true;  


function preload() { 
    startUnpressed = loadImage("assets/start_unpressed.png"); 
    startPressed = loadImage("assets/start_pressed.png");
    menuUnpressed = loadImage("assets/backToMenuUnpressed.png"); 
    menuPressed = loadImage("assets/backToMenuPressed.png");
    title = loadImage("assets/title.png");
    hole = loadImage("assets/hole_copy2.png");
    bg = loadImage("assets/newbg.png"); 
    img = loadImage("assets/molecpy.png"); 
    hammer = loadImage("assets/hammer.png"); 
    hammerHit = loadImage("assets/hammer2.png");
    instructions = loadImage("assets/instructions.png");
    insFont = loadFont('assets/UGLYBOY-ASPEKHNDZ.ttf'); 
}
    
function setup() {
    createCanvas(wid, hei);
    
    locations = [ { x:(wid/4), y: hei/4 }, { x:wid/4, y: hei/2 }, { x:wid/4, y: hei*0.75}, 
    { x:wid/2, y:hei/4 }, { x:wid/2, y:hei/2}, { x:wid/2, y:hei*0.75 },
    { x:wid*0.75, y:hei/4}, { x:wid*0.75, y:hei/2 }, { x:wid*0.75, y:hei*0.75} ];
        
    for (var i = 0; i < numMoles; i++){
        myMole.push(new Mole(locations[i].x, locations[i].y, img));
    }
}
    
function draw() {
    switch(programState) {
        case welcomeState:
            welcomeGame(); 
            break; 
        case gameState:
            playGame(); 
            break;
    }
    
    displayHammer();
}

function Mole (x, y, img) { 
    this.x = x; 
    this.y = y; 
    this.img = img; 
    this.hit = false; 
         
    this.totalMoleTime = int (random(50, 120)); 
    this.moleTime = 0; 
    
    this.graphics = createGraphics(140,160);
    this.gx = x*0.88; 
    this.gy = y-130; 
    
    

    this.isOver = function() { 
       if (spawnSize == 2) { 
           return (mouseX >= (this.x-largeX) && mouseX <= (this.x-largeX)+150 && mouseY >= (this.y-largeY) && mouseY <= (this.y-largeY)+200);
       } else if (spawnSize == 0) { 
           return (mouseX >= (this.x-smallX) && mouseX <= (this.x-smallX)+120 && mouseY >= (this.y-smallY) && mouseY <= (this.y-smallY)+100);
       } else if (spawnSize == 1) { 
           return (mouseX >= (this.x-medX) && mouseX <= (this.x-medX)+180 && mouseY >= (this.y-medY) && mouseY <= (this.y-medY) + 200);
       }
    }

    this.showMole = function() { 
        this.graphics.clear(); 

        if (spawnSize == 0) { 
            this.graphics.image(img, 40, this.y-this.gy, small, small);
        } else if (spawnSize == 1) { 
            this.graphics.image(img, 20, this.y-(this.gy+10), medium, medium);
        } else if (spawnSize == 2) { 
            this.graphics.image(img, -30, this.y-(this.gy+50), large, large); 
        }  

        if (timeTheCount) { 
            activateTime(); 
            timeTheCount = false; 
        }

        this.y = this.y - 8;
        var bound; 
        if (spawnSize == 0) {
            bound = y - 20; 
        } else if (spawnSize == 2) {  
            bound = y - 80;
        } else if (spawnSize == 1) {  
            bound = y - 40;
        }

        if (this.y <= bound) {
            this.y = bound;
        }
    }

    this.hideMole = function() { 
        this.graphics.clear(); 

        if (spawnSize == 0) { 
            this.graphics.image(img, 40, this.y-this.gy, small, small);
        } else if (spawnSize == 1) { 
            this.graphics.image(img, 20, this.y-(this.gy+10), medium, medium);
        } else if (spawnSize == 2) { 
            this.graphics.image(img, -30, this.y-(this.gy+50), large, large); 
        }
       
        this.y = this.y + 15;
        var bound = y + 60;
        if (this.y >= bound) {
            this.y = bound;

            if (this.hit) {
                score++;

                if ((moleSpawn === positions[current])) {
                    prevSpawnIndex = moleSpawn; 
                    current++;  
                    this.next(); 
                    if (current > (positions.length - 1)) {
                        current = 0;
                    }
                    moleSpawn = positions[current]; 
                    curSpawnIndex = moleSpawn; 
                    curHole++; 
                    if (curHole > (positions.length-1)) { 
                        curHole = 0; 
                    }   
                    nextHoleIndex = positions[curHole];

                    if (clickOnce === 1) { 
                        clickedOnFirstTry = true; 
                    } else { 
                        clickedOnFirstTry = false; 
                    }
                    resetClicks();

                   this.reset(); 
                }  
            }
            if (this.moleTime >= 100){
                this.reset();
            }
        }
    }

    this.reset = function() { 
        this.totalMoleTime = int (random(50, 120)); 
        this.moleTime = 0;
    }

    this.next = function() { 
        whichOne++; 
        if (whichOne > (moleSizes.length-1)) { 
            whichOne = 0; 
        }
        spawnSize = moleSizes[whichOne];

        nextSize++; 
        if (nextSize > (moleSizes.length-1)) { 
            nextSize = 0; 
        } 
        nextMoleSize = moleSizes[nextSize];
    }

    this.updatePosition = function() { 
        this.moleTime++; 


        if (this.moleTime > this.totalMoleTime) {
            this.hideMole(); 
            didTheMoleHideFirst = true; 
        }   
    }
}



function loadHoles() { 
    for (var i = 0; i < numMoles; i ++) {
        image(hole, locations[i].x*0.88, locations[i].y, 162, 64);
    }
}

function welcomeGame() { 
    progStartTime = millis();

    image(title, 0, 0, wid, hei);

    if (mouseX >= 50 && mouseX <= (50+250) && mouseY >= 50 && mouseY <= (50+100)){
        image (startPressed, 50, 20, 250, 125);
        if (mouseIsPressed) { 
            programState = gameState; 
        }
    } else {
        image (startUnpressed, 50, 20, 250, 125);  
    }

    displayInstructions();
}

function playGame() { 
    timeWhenGameStarts = millis() - progStartTime; 
    
    image(bg, 0, 0, wid, hei); 
  
    loadHoles(); 

    displayScore(); 

    myMole[moleSpawn].showMole();     
    
    myMole[moleSpawn].updatePosition();

    if (myMole[moleSpawn].hit) { 
        didTheMoleHideFirst = false;

        myMole[moleSpawn].hideMole(); 
    }
    
    image(myMole[moleSpawn].graphics, myMole[moleSpawn].gx, myMole[moleSpawn].gy);

    if (mouseX >= 0 && mouseX <= (0+200) && mouseY >= 800 && mouseY <= (800+200)){
        image (menuPressed, 0, 850, 200, 49);
        if (mouseIsPressed) { 
            programState = welcomeState; 
        }
    } else {
        image(menuUnpressed, 0, 850, 200, 49);
    } 

    logMouse();
}

function displayHammer() { 
    if (mouseIsPressed) {
        image(hammerHit, mouseX-15, mouseY-50, 80, 80);
    } else { 
        image(hammer, mouseX-15, mouseY-50, 80, 80); 
    }
}

function displayScore() { 
    textFont(insFont);
    textSize(74);
    fill(255);
    text('SCoRE: ' + score, 956, 70);
    textSize(70);
    fill('#4d3b3b');
    text('SCoRE: ' + score, 954, 70);
}

function displayInstructions() { 
    image(instructions, 1030, 860, 170, 46);
    if (mouseX >= 1030 && mouseX <= (1030+200) && mouseY >= 860 && mouseY<= (860+200)){
        fill (153, 180);
        noStroke();
        rect (width/5, height/5, 700, 530);

        textAlign(CENTER);
        fill(0);
        textFont(insFont);
        textSize(40);
        text('WHACK A MoLE GAME INSTRUCTIoNS: ', 320, 230, 580, 300);
        fill(235);
        text('PRESS START TO BEGIN PLAYING WHACK A MOLE. PRESS BACK TO MENU TO EXIT. GRAPHICS BY AMY. FONT FROM DAFONT.COM', 320, 300, 580, 300);
        text('CREATED BY AMY KWAN (UoFS CoMPUTER SCIENCE, 2017) UNDER THE SUPERVISION OF DR. REGAN MANDRYK.', 320, 530, 580, 300);
    }
}

function generateDate() { 
    var m = month(); 
    var d = day(); 
    var y = year();
    
    var h = hour(); 
    var min = minute(); 
    var s = second(); 
    var mil = timeWhenGameStarts; 

    timeStamp = (y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s + "." + mil); 
}

function mousePressed() {
   if (programState == gameState) {

       for (var i = 0; i < numMoles; i++) {
            if (myMole[i].isOver()) {
                myMole[i].hit = true; 
            } else {
                myMole[i].hit = false; 
            } 
        }
        clickOnce++; 
       if (active) {  
        active = false; 
        stopTime = timeWhenGameStarts; 
        timeTheCount = true; 
    }

       pressedX = mouseX;
       pressedY = mouseY;

        logTarget(); 

    }
}

function logMouse() {
    generateDate();
    
}


function activateTime() { 
    active = true;
    timeShown = timeWhenGameStarts; 
}

function resetClicks() { 
    clickOnce = 0; 
}

function logTarget () { 
    
    targetX = myMole[curSpawnIndex].x; 
    targetY = locations[curSpawnIndex].y; 
   
    if (spawnSize == 2) { 
        sizeOfMole = large;         
    } else if (spawnSize == 1) {
        sizeOfMole = medium; 
    } else if (spawnSize == 0) { 
        sizeOfMole = small; 
    }

    distance = dist(myMole[prevSpawnIndex].x, locations[prevSpawnIndex].y, myMole[curSpawnIndex].x, locations[curSpawnIndex].y);
    
    
    if (!active) { 
       timeFromShownToMouseDown = stopTime - timeShown; 
    }
    
}
