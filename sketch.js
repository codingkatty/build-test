// Game state variable
let gameState = 'menu';
// Track if mouse is over a button
let overButton = false;

function setup() {
    var myCanvas = createCanvas(1200, 675);
    myCanvas.parent('game-container');
    background(255, 255, 255);
    textAlign(CENTER, CENTER);
}

function draw() {
    background(255); // Clears previous frames
    
    if (gameState === 'menu') {
        drawMenu();
    }
    // Other game states would go here later
    
    // Set cursor style based on button hover
    updateCursor();
}

function drawMenu() {
    // Title
    fill(0);
    textSize(80);
    textStyle(BOLD);
    text("Cat Escape", width/2, 300);
    textStyle(NORMAL);
    
    // Default button colors
    let startColor = color(21, 62, 100);
    let rulesColor = color(21, 62, 100);
    
    // Reset button hover state
    overButton = false;
    
    // Change color if hovering and handle clicks
    if (mouseX > 330 && mouseX < 580 && mouseY > 400 && mouseY < 500) {
        startColor = color(25, 99, 168);
        overButton = true;
        if (mouseIsPressed) {
            console.log("Start button clicked");
            // Later this would change gameState to 'playing'
        }
    }
    
    if (mouseX > 630 && mouseX < 880 && mouseY > 400 && mouseY < 500) {
        rulesColor = color(25, 99, 168);
        overButton = true;
        if (mouseIsPressed) {
            console.log("Rules button clicked");
            // Later this would change gameState to 'rules'
        }
    }
    
    // Draw buttons
    noStroke();
    fill(startColor);
    rect(330, 400, 250, 100, 40);
    
    fill(rulesColor);
    rect(630, 400, 250, 100, 40);
    
    // Button text
    fill(255);
    textSize(30);
    text("Start", 330 + 125, 450);
    text("Game Rules", 630 + 125, 450);
}

function updateCursor() {
    // Change cursor style based on button hover
    if (overButton) {
        cursor(HAND);
    } else {
        cursor(ARROW);
    }
}