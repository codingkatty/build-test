// Game state variable
let gameState = 'menu';
// Track if mouse is over a button
let overButton = false;
let showModal = false; // Track if modal should be displayed

function setup() {
    var myCanvas = createCanvas(1200, 675);
    myCanvas.parent('game-container');
    textAlign(CENTER, CENTER);
}

function draw() {
    background(230, 238, 255); // Clears previous frames
    
    if (gameState === 'menu') {
        drawMenu();
    }

    if (showModal) {
        drawModal();
    }

    updateCursor();
}

function drawMenu() {
    // Title
    fill(0);
    textSize(80);
    textStyle(BOLD);
    text("Cat Escape", width/2, 300);
    textStyle(NORMAL);

    let startColor = color(21, 62, 100);
    let rulesColor = color(21, 62, 100);
    overButton = false;

    // Start Button
    if (mouseX > 330 && mouseX < 580 && mouseY > 400 && mouseY < 500) {
        startColor = color(25, 99, 168);
        overButton = true;
        if (mouseIsPressed) {
            console.log("Start button clicked");
        }
    }

    // Rules Button
    if (mouseX > 630 && mouseX < 880 && mouseY > 400 && mouseY < 500) {
        rulesColor = color(25, 99, 168);
        overButton = true;
        if (mouseIsPressed) {
            console.log("Rules button clicked");
            showModal = true; // Show modal
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

function drawModal() {
    // Modal background
    fill(255);
    stroke(0);
    rect(400, 200, 400, 250, 20);

    // Modal text
    fill(0);
    textSize(30);
    text("Game Rules", 600, 230);
    textSize(20);
    text("1. Use arrow keys to move.", 600, 280);
    text("2. Avoid obstacles.", 600, 320);
    text("3. Reach the goal to win!", 600, 360);

    // Close button (X)
    fill(255, 0, 0);
    ellipse(770, 220, 30, 30);
    fill(255);
    textSize(20);
    text("X", 770, 220);
}

// Check for close button click
function mousePressed() {
    // If close button (X) is clicked
    if (showModal && dist(mouseX, mouseY, 770, 220) < 15) {
        showModal = false;
    }
}

function updateCursor() {
    if (overButton || (showModal && dist(mouseX, mouseY, 770, 220) < 15)) {
        cursor(HAND);
    } else {
        cursor(ARROW);
    }
}
