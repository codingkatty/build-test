function setup() {
    var myCanvas = createCanvas(1200, 675);
    myCanvas.parent('game-container');
    background(255, 255, 255);
}

function draw() {
    background(255); // Clears previous frames to prevent overdraw

    // Default color
    let buttonColor1 = color(21, 62, 100);
    let buttonColor2 = color(21, 62, 100);

    // Change color if either button is clicked
    if (mouseIsPressed) {
        if (mouseX > 330 && mouseX < 580 && mouseY > 400 && mouseY < 500) { 
            buttonColor1 = color(25, 99, 168);
        }
        if (mouseX > 630 && mouseX < 880 && mouseY > 400 && mouseY < 500) { 
            buttonColor2 = color(25, 99, 168);
        }
    }

    noStroke();

    // Draw first button
    fill(buttonColor1);
    rect(330, 400, 250, 100, 40); // Button 1 at x=330

    // Draw second button
    fill(buttonColor2);
    rect(630, 400, 250, 100, 40); // Button 2 at x=630 (gives spacing)

    // Button texts
    fill(255);
    textSize(30);
    textAlign(CENTER, CENTER);
    
    text("Start", 330 + 125, 450); // Start button text centered
    text("Rules", 630 + 125, 450); // Rules button text centered
}

