function setup() {
    var myCanvas = createCanvas(1200, 675);
    myCanvas.parent('game-container');
    background(255, 255, 255);
}

draw = function() {
    fill(21, 62, 100); // start color

    if (mouseIsPressed && mouseX > 330 && mouseX < 580 && mouseY > 400 && mouseY < 500) { 
        fill(25, 99, 168); // click color
    }
    noStroke();
    rect(330, 400, 250, 100, 40);  // the button

    // The button text
    fill(255, 255, 255);
    textSize(30);
    textAlign(CENTER, CENTER); // Center the text
    text("Start", 330 + 250 / 2, 400 + 100 / 2); // Centering the text inside the button
};
