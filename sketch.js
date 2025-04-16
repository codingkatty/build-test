let pixel1,
  pixel2,
  cat_frame1,
  cat_frame2,
  cat_base,
  cat_eyes1,
  cat_eyes2,
  cat_eyes3,
  cat_eyes4;
let mouse_run1, mouse_run2, bird_fly1, bird_fly2, cat_chaser, mouse, bird;

let gameState = "menu";
let overButton = false;
let showModal = false;

let selectedCharacter1 = "mouse";
let selectedCharacter2 = "mouse";
let player1Confirmed = false;
let player2Confirmed = false;

let counter = 0;
let mousePlayer, birdPlayer;

let animationProgress = 0;
let frameCounter = 0;
let anim_catX = 80;
let anim_mouseX = 300;
let anim_birdX = 280;
let anim_black_h = 100;

let timerDuration = 120;
let currentTime = timerDuration;
let timerStarted = false;
let timerPaused = false;
let lastTime = 0;

let boxes = [];
let bgm, oof;

function preload() {
  pixel1 = loadFont("../fonts/alagard.ttf");
  pixel2 = loadFont("../fonts/minecraft_font.ttf");

  cat_frame1 = loadImage("../assets/cat_walk_test1.png");
  cat_frame2 = loadImage("../assets/cat_walk_test2.png");
  cat_base = loadImage("../assets/cat_base_test.png");

  cat_eyes1 = loadImage("../assets/cat_eyes_test1.png");
  cat_eyes2 = loadImage("../assets/cat_eyes_test2.png");
  cat_eyes3 = loadImage("../assets/cat_eyes_test3.png");
  cat_eyes4 = loadImage("../assets/cat_eyes_test4.png");

  mouse_run1 = loadImage("../assets/mouse_run_anim_test1.png");
  mouse_run2 = loadImage("../assets/mouse_run_anim_test2.png");

  bird_fly1 = loadImage("../assets/bird_run_anim_test1.png");
  bird_fly2 = loadImage("../assets/bird_run_anim_test2.png");

  cat_chaser = loadImage("../assets/vio_cat_test.png");

  mouse = loadImage("../assets/mouse-vio.png");
  bird = loadImage("../assets/birdieeee.png");

  bgm = loadSound("../assets/scary_song.mp3");
  bgm.setVolume(0.4);

  oof = loadSound("../assets/oof.mp3");
}

class Player {
  constructor(
    x,
    y,
    img,
    gravity,
    up,
    down,
    left,
    right,
    width = 200,
    height = 200
  ) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.gravity = gravity;

    this.width = width;
    this.height = height;

    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;

    this.isGrounded = false;
    this.jumpForce = 0;
    this.velocity = 0;
  }

  move(boxList) {
    let prevX = this.x;
    let prevY = this.y;

    if (this.gravity) {
      // Reset grounded state
      this.isGrounded = false;

      // Check if player is on ground
      for (let box of boxList) {
        if (
          this.x + this.width > box.x + 5 &&
          this.x < box.x + box.w - 5 &&
          Math.abs(this.y + this.height - box.y) < 2
        ) {
          this.isGrounded = true;
          break;
        }
      }

      // Handle jumping
      if (this.isGrounded) {
        if (keyIsDown(this.up)) {
          this.velocity = -10;
          this.isGrounded = false;
        } else {
          this.velocity = 0;
        }
      } else {
        this.velocity += 0.5; // Gravity
      }

      // Apply vertical movement
      this.y += this.velocity;
      if (this.checkCollision(boxList)) {
        this.y = prevY;
        if (this.velocity > 0) {
          this.isGrounded = true;
        }
        this.velocity = 0;
      }

      // Apply horizontal movement
      if (keyIsDown(this.left)) {
        this.x -= 5;
        if (this.checkCollision(boxList)) {
          this.x = prevX;
        }
      }
      if (keyIsDown(this.right)) {
        this.x += 5;
        if (this.checkCollision(boxList)) {
          this.x = prevX;
        }
      }
    } else {
      // Flying character (bird) movement remains the same
      if (keyIsDown(this.up)) {
        this.y -= 5;
        if (this.checkCollision(boxList)) {
          this.y = prevY;
        }
      }
      if (keyIsDown(this.down)) {
        this.y += 5;
        if (this.checkCollision(boxList)) {
          this.y = prevY;
        }
      }
      if (keyIsDown(this.left)) {
        this.x -= 5;
        if (this.checkCollision(boxList)) {
          this.x = prevX;
        }
      }
      if (keyIsDown(this.right)) {
        this.x += 5;
        if (this.checkCollision(boxList)) {
          this.x = prevX;
        }
      }
    }
  }

  checkCollision(boxList) {
    for (let box of boxList) {
      if (
        this.x < box.x + box.w &&
        this.x + this.width > box.x &&
        this.y < box.y + box.h &&
        this.y + this.height > box.y
      ) {
        if (
          this.x + this.width > box.x &&
          this.x < box.x + box.w &&
          this.y + this.height > box.y &&
          this.y < box.y + box.h
        ) {
          return true;
        }
      }
    }
    return false;
  }

  show() {
    image(this.img, this.x, this.y, this.width, this.height);
  }
}

function setup() {
  var myCanvas = createCanvas(1200, 675);
  myCanvas.parent("game-container");
  textAlign(CENTER, CENTER);
  textFont(pixel2);
  textSize(30);
  bgm.loop();

  mousePlayer = new Player(
    200,
    100,
    mouse,
    true,
    UP_ARROW,
    DOWN_ARROW,
    LEFT_ARROW,
    RIGHT_ARROW,
    80,
    80
  );
  birdPlayer = new Player(100, 100, bird, false, 87, 83, 65, 68, 150, 150);
}

function draw() {
  background(230, 238, 255);

  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "story") {
    drawStory();
  } else if (gameState === "costume") {
    drawCostume();
  } else if (gameState === "level1") {
    drawLevel1();
  } else if (gameState === "level1door") {
    drawLevel1Door();
  } else if (gameState === "correct") {
    correct();
  } else if (gameState === "level2") {
  } else if (gameState === "gameover") {
    background(0, 0, 0);
    fill(255);
    textSize(30);
    textAlign(CENTER);
    text("(you died)", width / 2, height / 2);
  }

  if (showModal) {
    drawModal();
  }

  updateCursor();
  overButton = false;
  counter++;

  // debug
  // textSize(20);
  // fill(0);
  // text("mouseX: " + Math.floor(mouseX) + " mouseY: " + Math.floor(mouseY), 200, 100);
}

function startTimer() {
  timerStarted = true;
  timerPaused = false;
  lastTime = millis();
}

function pauseTimer() {
  timerPaused = true;
}

function resumeTimer() {
  if (timerStarted) {
    timerPaused = false;
    lastTime = millis();
  }
}

function resetTimer() {
  currentTime = timerDuration;
  timerStarted = false;
  timerPaused = false;
}

function updateTimer() {
  if (timerStarted && !timerPaused) {
    let currentMillis = millis();
    let deltaTime = (currentMillis - lastTime) / 1000; // Convert to seconds
    lastTime = currentMillis;

    currentTime -= deltaTime;

    if (currentTime <= 0) {
      currentTime = 0;
      timerStarted = false;
      // Handle time's up event
      console.log("Time's up!");
      gameState = "gameover";
      oof.play();
    }
  }
}

function drawTimer(c = 0) {
  // Draw timer UI
  push();
  fill(c);
  noStroke();
  textSize(24);
  textAlign(LEFT, TOP);

  // Convert seconds to MM:SS format
  let minutes = Math.floor(currentTime / 60);
  let seconds = Math.floor(currentTime % 60);
  let timeString = nf(minutes, 2) + ":" + nf(seconds, 2);

  // Draw timer and controls
  text(timeString, 10, 10);
  pop();
}

function drawMenu() {
  // Title
  fill(0);
  textFont(pixel1);
  textSize(80);
  textStyle(BOLD);
  text("Cat Escape", width / 2, 300);
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
      gameState = "story"; // Change game state to story
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
  textSize(26);
  textFont(pixel2);
  text("Start", 330 + 125, 450);
  text("Game Rules", 630 + 125, 450);
}

function drawStory() {
  background(100, 0, 0);
  if (animationProgress < 100) {
    frameCounter = (frameCount / 10) % 2;

    if (frameCounter < 1) {
      image(cat_frame1, 300, 0);
    } else {
      image(cat_frame2, 300, 0);
    }
    animationProgress++;
  } else if (animationProgress < 150) {
    image(cat_base, 300, 50);
    animationProgress++;
  } else if (animationProgress < 240) {
    frameCounter = Math.min((animationProgress - 150) / 2, 3);

    background(220, 30, 30);
    image(cat_base, 300, 50);

    if (frameCounter < 1) {
      image(cat_eyes1, 330, 250);
    } else if (frameCounter < 2) {
      image(cat_eyes2, 330, 250);
    } else if (frameCounter < 3) {
      image(cat_eyes3, 330, 250);
    } else {
      image(cat_eyes4, 330, 250);
    }
    animationProgress++;
  } else if (animationProgress < 550) {
    frameCounter = (frameCount / 10) % 2;

    background(255);

    image(cat_chaser, anim_catX, 300, 220, 220);

    if (frameCounter < 1) {
      image(mouse_run1, anim_mouseX, 400, 96, 72);
      image(bird_fly1, anim_birdX, 200, 120, 120);
    } else {
      image(mouse_run2, anim_mouseX, 400, 96, 72);
      image(bird_fly2, anim_birdX, 200, 120, 120);
    }

    fill(0);
    rect(0, 0, 1200, anim_black_h);
    rect(0, 675 - anim_black_h, 1200, anim_black_h);

    anim_catX += 4;
    anim_mouseX += 5;
    anim_birdX += 4;

    if (anim_black_h < 140) {
      anim_black_h += 1;
    }

    if (animationProgress > 480) {
      anim_black_h -= (animationProgress - 480) / 10;
      animationProgress++;
    }
    animationProgress++;
  } else {
    gameState = "costume";
    animationProgress = 0;
  }
}

function drawCostume() {
  // Title
  fill(0);
  textFont(pixel1);
  textSize(80);
  textStyle(BOLD);
  text("Select your character", width / 2, 100);
  textStyle(NORMAL);

  // Player 1 selection
  textSize(30);
  text("Player 1 (wasd)", 300, 200);

  // Left arrow button
  if (mouseX > 150 && mouseX < 180 && mouseY > 270 && mouseY < 330) {
    overButton = true;
  }
  triangle(150, 300, 180, 270, 180, 330);

  // Display current character
  if (selectedCharacter1 === "mouse") {
    image(mouse, 185, 240, 220, 190);
  } else {
    image(bird, 200, 240, 200, 200);
  }

  // Right arrow button
  if (mouseX > 410 && mouseX < 440 && mouseY > 270 && mouseY < 330) {
    overButton = true;
  }
  triangle(440, 300, 410, 270, 410, 330);

  // Player 2 selection
  text("Player 2 (arrow keys)", 900, 200);

  // Left arrow button
  if (mouseX > 760 && mouseX < 790 && mouseY > 270 && mouseY < 330) {
    overButton = true;
  }
  triangle(760, 300, 790, 270, 790, 330);

  // Display current character
  if (selectedCharacter2 === "mouse") {
    image(mouse, 800, 240, 220, 190);
  } else {
    image(bird, 800, 240, 200, 200);
  }

  // Right arrow button
  if (mouseX > 1030 && mouseX < 1060 && mouseY > 270 && mouseY < 330) {
    overButton = true;
  }
  triangle(1060, 300, 1030, 270, 1030, 330);

  // Confirm buttons
  if (!player1Confirmed) {
    fill(0, 255, 0);
    if (mouseX > 225 && mouseX < 375 && mouseY > 450 && mouseY < 500) {
      overButton = true;
      fill(0, 200, 0);
    }
    rect(225, 450, 150, 50);
    fill(255);
    text("Confirm", 302, 475);
  }

  if (!player2Confirmed) {
    fill(0, 255, 0);
    if (mouseX > 830 && mouseX < 980 && mouseY > 450 && mouseY < 500) {
      overButton = true;
      fill(0, 200, 0);
    }
    rect(830, 450, 150, 50);
    fill(255);
    text("Confirm", 907, 475);
  }

  if (player1Confirmed && player2Confirmed) {
    updatePlayerControls();
    gameState = "level1";
    counter = 0;
  }
}

function updatePlayerControls() {
  // Player 1 (WASD)
  if (selectedCharacter1 === "mouse") {
    mousePlayer = new Player(200, 100, mouse, true, 87, 83, 65, 68, 80, 80); // W,S,A,D
  } else {
    birdPlayer = new Player(100, 100, bird, false, 87, 83, 65, 68, 150, 150); // W,S,A,D
  }

  // Player 2 (Arrow Keys)
  if (selectedCharacter2 === "mouse") {
    mousePlayer = new Player(
      200,
      100,
      mouse,
      true,
      UP_ARROW,
      DOWN_ARROW,
      LEFT_ARROW,
      RIGHT_ARROW,
      80,
      80
    );
  } else {
    birdPlayer = new Player(
      100,
      100,
      bird,
      false,
      UP_ARROW,
      DOWN_ARROW,
      LEFT_ARROW,
      RIGHT_ARROW,
      150,
      150
    );
  }
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
  text("1. Use arrow keys & WASD to move.", 600, 280);
  text("2. Work together.", 600, 320);
  text("3. Use your brain!", 600, 360);

  // Close button (X)
  fill(255, 0, 0);
  ellipse(770, 220, 30, 30);
  fill(255);
  textSize(20);
  text("X", 771, 218);
}

let buttonX, buttonY, buttonW, buttonH;
let buttonActivated = false;
let buttonHovered = false;
let newButtonX, newButtonY, newButtonW, newButtonH;
let newButtonActivated = false;
let newButtonHovered = false;
let doorUnlocked = false;
let doorMessageTimeout = 0;
let mouseBlock = null;
let mouseBlockIndex = -1;

let mouseHole = [30, 555, 100, 300];
// doors data
let doorsRiddle = [
  { x: 200, y: 200, w: 150, h: 200, c: [204, 51, 0] },
  { x: 525, y: 200, w: 150, h: 200, c: [0, 204, 180] },
  { x: 850, y: 200, w: 150, h: 200, c: [102, 0, 255] },
];
let riddles = [
  "The second letter of the alphabet,\nand a very long stick.\nIts rather twisted;\nthough it closes up.",
  "Maybe the sky,\nor maybe the sea.\nWhat I see?\nthe sacred color of mice.",
  "Heartbroken,\nflooded in tears of blood.\nRoses aren't red;\nso aren't violets...",
];
let randomR = Math.floor(Math.random() * 3);
let hinttxt = "are mice colorblind??";

function setupLevel1() {
  boxes = [];

  // Platforms and walls
  boxes.push(new boxItem(200, height - 200, 200, 30, color(100, 70, 50))); // Main platform
  boxes.push(new boxItem(600, height - 300, 200, 30, color(100, 70, 50))); // Higher platform

  if (!doorUnlocked) {
    boxes.push(
      new boxItem(width - 50, height - 200, 50, 200, color(160, 82, 45))
    );
  }

  // Ground
  boxes.push(new boxItem(0, height - 20, width, 30, color(100, 50, 50)));
  // pressure plate activated blocker
  mouseBlockIndex = boxes.length;
  mouseBlock = new boxItem(0, 520, 150, 100, color(0, 180, 0));
  boxes.push(mouseBlock);

  // Button positions (relative to your level design)
  buttonW = 80;
  buttonH = 30;
  buttonX = 250; // On the main platform
  buttonY = height - 200 - buttonH - 10;

  newButtonW = 80;
  newButtonH = 30;
  newButtonX = width - 100; // Near the door
  newButtonY = height - 200 - newButtonH - 60;

  console.log(boxes);
}

function drawLevel1() {
  if (counter === 100) {
    setupLevel1();
    resetTimer();
    startTimer();
  }

  if (counter > 100) {
    if (doorUnlocked) {
      fill(0, 255, 0);
      textSize(30);
      text("Level 2 ->", width - 100, 300);
      if (mousePlayer.x > width && birdPlayer.x > width) {
        gameState = "level2";
        doorUnlocked = false;
      }
    }

    // hint, top right corner
    fill(0, 0, 0);
    textSize(20);
    push();
    translate(width - 100, 70);
    rotate(-75);
    text(hinttxt, 0, 0);
    pop();

    updateTimer();
    drawTimer();
    drawMouseHole();
    // Draw boxes
    for (let box of boxes) {
      box.show();
    }

    drawFirstButton();
    if (newButtonActivated) {
      drawSecondButton();
    }
    checkButtonInteractions();

    mousePlayer.show();
    mousePlayer.move(boxes);

    birdPlayer.show();
    birdPlayer.move(boxes);
  } else {
    fill(0);
    textSize(50);
    text("Level 1", width / 2, height / 2);
  }
}

function drawLevel1Door() {
  background(0);
  updateTimer();
  drawTimer(color(255, 255, 255));

  for (let door of doorsRiddle) {
    if (
      collideRectRect(
        mousePlayer.x,
        mousePlayer.y,
        mousePlayer.width,
        mousePlayer.height,
        door.x,
        door.y,
        door.w,
        door.h
      )
    ) {
      stroke(255, 215, 0);
    } else {
      stroke(0);
    }
    strokeWeight(5);
    fill(door.c[0], door.c[1], door.c[2]);
    rect(door.x, door.y, door.w, door.h);

    noStroke();
    // door knob
    fill(255, 215, 0);
    circle(door.x + door.w - 120, door.y + 80, 20);
  }

  textSize(30);
  fill(255);
  textAlign(CENTER);
  text(
    "You find yourself in front of 3 doors...\nTwo would lead to your doom. Choose wisely. (press 'e')",
    width / 2,
    100
  );

  textAlign(LEFT);
  text(riddles[randomR], 30, 500);
  mousePlayer.show();
  mousePlayer.move(boxes);

  // door collide
  for (let i = 0; i < doorsRiddle.length; i++) {
    let door = doorsRiddle[i];
    if (
      collideRectRect(
        mousePlayer.x,
        mousePlayer.y,
        mousePlayer.width,
        mousePlayer.height,
        door.x,
        door.y,
        door.w,
        door.h
      )
    ) {
      if (
        collideRectRect(
          mousePlayer.x,
          mousePlayer.y,
          mousePlayer.width,
          mousePlayer.height,
          doorsRiddle[2].x,
          doorsRiddle[2].y,
          doorsRiddle[2].w,
          doorsRiddle[2].h
        ) &&
        keyIsDown(69)
      ) {
        console.log("win");
        gameState = "correct";
      } else if (keyIsDown(69)) {
        console.log("lose");
        gameState = "gameover";
        oof.play();
      }
    }
  }
}

let texty = 500;
function correct() {
  background(0, 30, 0);
  fill(255);
  textSize(80);
  textAlign(CENTER);
  text("Correct.", width / 2, texty);

  if (texty > 350) {
    texty -= 1;
    counter = 0;
  } else if (counter > 100) {
    gameState = "level1";
    doorUnlocked = true;
    setupLevel1();
    mousePlayer.gravity = true;
    mousePlayer.x = 200;
    hinttxt = "yeah. duh.";
  } else {
    counter += 2;
  }
}

function checkButtonInteractions() {
  // Check both players for button interactions
  buttonHovered =
    collideRectRect(
      mousePlayer.x,
      mousePlayer.y,
      mousePlayer.width,
      mousePlayer.height,
      buttonX,
      buttonY,
      buttonW,
      buttonH
    ) ||
    collideRectRect(
      birdPlayer.x,
      birdPlayer.y,
      birdPlayer.width,
      birdPlayer.height,
      buttonX,
      buttonY,
      buttonW,
      buttonH
    );

  // Activate first button on hover
  if (buttonHovered) {
    console.log("Button hovered");
    if (mouseBlockIndex >= 0 && mouseBlockIndex < boxes.length) {
      boxes.splice(mouseBlockIndex, 1);
      mouseBlockIndex = -1;
      buttonActivated = true;
    }
  } else {
    if (mouseBlockIndex === -1) {
      mouseBlock = new boxItem(30, 480, 150, 100, color(0, 180, 0));
      boxes.push(mouseBlock);
      mouseBlockIndex = boxes.length - 1;
      buttonActivated = false;
    }
  }
  //newButtonActivated = true;

  /*
  // Second button hover check (only if active)
  if (newButtonActivated) {
    newButtonHovered =
      collideRectRect(
        mousePlayer.x,
        mousePlayer.y,
        mousePlayer.width,
        mousePlayer.height,
        newButtonX,
        newButtonY,
        newButtonW,
        newButtonH
      ) ||
      collideRectRect(
        birdPlayer.x,
        birdPlayer.y,
        birdPlayer.width,
        birdPlayer.height,
        newButtonX,
        newButtonY,
        newButtonW,
        newButtonH
      );
  }*/

  mouseHoleDetect = collideRectRect(
    mousePlayer.x,
    mousePlayer.y,
    mousePlayer.width,
    mousePlayer.height,
    mouseHole[0],
    mouseHole[1],
    mouseHole[2],
    mouseHole[3]
  );
  if (mouseHoleDetect && !doorUnlocked) {
    console.log("mouse hole!!");
    gameState = "level1door";
    boxes = [];
    mousePlayer.gravity = false;
  }
}

function drawFirstButton() {
  if (buttonHovered && !buttonActivated)
    fill(255, 182, 193); // Light pink when hovering
  else if (buttonActivated) fill(139, 0, 0); // Dark red when activated
  else fill(255, 0, 0); // Red when idle
  noStroke();
  rect(buttonX, buttonY, buttonW, buttonH);
}
/*
function drawSecondButton() {
  if (newButtonHovered) fill(255, 255, 0); // Yellow when hovering
  else fill(0, 255, 0); // Green normally

  noStroke();
  rect(newButtonX, newButtonY, newButtonW, newButtonH);

  // Unlock door when hovered (could change to require key press)
  if (newButtonHovered) {
    doorUnlocked = true;
    doorMessage = "Door Unlocked!";
    doorMessageTimeout = frameCount;
  }
}*/

function drawMouseHole() {
  fill(0, 0, 0);
  noStroke();
  rect(mouseHole[0], mouseHole[1], mouseHole[2], mouseHole[3]);
  circle(mouseHole[0] + mouseHole[2] / 2, mouseHole[1], mouseHole[2]);
}

// Helper function for rectangle collision
function collideRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  // Make collision detection more forgiving with a small overlap threshold
  const overlap = 5;
  const collision =
    x1 < x2 + w2 + overlap &&
    x1 + w1 > x2 - overlap &&
    y1 < y2 + h2 + overlap &&
    y1 + h1 > y2 - overlap;

  return collision;
}
function updateCursor() {
  if (overButton || (showModal && dist(mouseX, mouseY, 770, 220) < 15)) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function mousePressed() {
  // If close button (X) is clicked
  if (showModal && dist(mouseX, mouseY, 770, 220) < 15) {
    showModal = false;
  }

  const characters = ["mouse", "bird"];
  if (!player1Confirmed) {
    // Left arrow
    if (mouseX > 150 && mouseX < 180 && mouseY > 270 && mouseY < 330) {
      let currentIndex = characters.indexOf(selectedCharacter1);
      if (currentIndex === 0) {
        selectedCharacter1 = characters[characters.length - 1];
      } else {
        selectedCharacter1 = characters[currentIndex - 1];
      }
    }
    // Right arrow
    if (mouseX > 410 && mouseX < 440 && mouseY > 270 && mouseY < 330) {
      let currentIndex = characters.indexOf(selectedCharacter1);
      if (currentIndex === characters.length - 1) {
        selectedCharacter1 = characters[0];
      } else {
        selectedCharacter1 = characters[currentIndex + 1];
      }
    }
    // Confirm button
    if (mouseX > 225 && mouseX < 375 && mouseY > 450 && mouseY < 500) {
      if (!(player2Confirmed && selectedCharacter1 === selectedCharacter2)) {
        player1Confirmed = true;
      }
    }
  }

  // Player 2 controls
  if (!player2Confirmed) {
    // Left arrow
    if (mouseX > 760 && mouseX < 790 && mouseY > 270 && mouseY < 330) {
      let currentIndex = characters.indexOf(selectedCharacter2);
      if (currentIndex === 0) {
        selectedCharacter2 = characters[characters.length - 1];
      } else {
        selectedCharacter2 = characters[currentIndex - 1];
      }
    }
    // Right arrow
    if (mouseX > 1030 && mouseX < 1060 && mouseY > 270 && mouseY < 330) {
      let currentIndex = characters.indexOf(selectedCharacter2);
      if (currentIndex === characters.length - 1) {
        selectedCharacter2 = characters[0];
      } else {
        selectedCharacter2 = characters[currentIndex + 1];
      }
    }
    // Confirm button
    if (mouseX > 830 && mouseX < 980 && mouseY > 450 && mouseY < 500) {
      if (!(player1Confirmed && selectedCharacter1 === selectedCharacter2)) {
        player2Confirmed = true;
      }
    }
  }
}

class boxItem {
  constructor(x, y, w, h, color) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  show() {
    fill(this.color);
    stroke(0);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h); // Removed rounded corners for better collision
  }
}

function setupLevel2() {}

function drawLevel2() {}

/*P5.js code for level 2
let ballReleased = false;
let levelComplete = false;
let leverActivated = false;
let canVisible = true;

function setup() {
  createCanvas(800, 600);
  
  // Create game objects
  mouse = {
    x: 100,
    y: 500,
    width: 20,
    height: 15,
    speed: 4,
    color: color(150, 150, 150)
  };
  
  bird = {
    x: 50,
    y: 500,
    width: 25,
    height: 20,
    speed: 5,
    color: color(255, 200, 0)
  };
  
  can = {
    x: 400,
    y: 500,
    width: 50,
    height: 80,
    color: color(200, 50, 50)
  };
  
  button = {
    x: 600,
    y: 200,
    width: 40,
    height: 10,
    pressed: false,
    color: color(255, 0, 0)
  };
  
  ball = {
    x: 620,
    y: 150,
    radius: 15,
    released: false,
    ySpeed: 0,
    xSpeed: 0,
    gravity: 0.5,
    color: color(50, 50, 200),
    grounded: false
  };
  
  exit = {
    x: 700,
    y: 440,
    width: 60,
    height: 80,
    color: color(100, 100, 100)
  };
  
  lever = {
    x: 650,
    y: 510,
    width: 20,
    height: 10,
    activated: false,
    color: color(200, 200, 0)
  };
}

function draw() {
  background(220);
  
  // Draw ground
  fill(100, 70, 50);
  rect(0, 520, width, 80);
  
  // Draw platform for button
  fill(100, 70, 50);
  rect(550, 200, 150, 20);
  
  // Draw exit door
  fill(exit.color);
  rect(exit.x, exit.y, exit.width, exit.height);
  
  if (leverActivated) {
    // Draw open door
    fill(0, 200, 0);
    rect(exit.x + 5, exit.y + 5, exit.width - 10, exit.height - 10);
    text("EXIT OPEN", exit.x + 5, exit.y + 30);
  } else {
    // Draw closed door
    line(exit.x + 10, exit.y + 10, exit.x + exit.width - 10, exit.y + exit.height - 10);
    line(exit.x + exit.width - 10, exit.y + 10, exit.x + 10, exit.y + exit.height - 10);
    text("LOCKED", exit.x + 12, exit.y + 30);
  }
  
  // Draw lever in front of the door
  fill(lever.color);
  rect(lever.x, lever.y, lever.width, lever.height);
  // Draw lever base
  fill(100);
  rect(lever.x - 2, lever.y + lever.height, lever.width + 4, 5);
  
  // Draw can - only if it's still visible
  if (canVisible) {
    fill(can.color);
    rect(can.x, can.y, can.width, can.height, 5);
    // Can details
    fill(180);
    rect(can.x + 5, can.y + 10, can.width - 10, 5);
    rect(can.x + 5, can.y + 30, can.width - 10, 5);
    rect(can.x + 5, can.y + 50, can.width - 10, 5);
  }
  
  // Draw button
  fill(button.pressed ? color(150, 0, 0) : button.color);
  rect(button.x, button.y, button.width, button.height);
  
  // Draw ball
  if (button.pressed || ball.released) {
    fill(ball.color);
    circle(ball.x, ball.y, ball.radius * 2);
  }
  
  // Draw characters
  drawCharacter(mouse, "MOUSE");
  drawCharacter(bird, "BIRD");
  
  // Highlight active character
  if (activeCharacter === "mouse") {
    stroke(255, 255, 0);
    strokeWeight(3);
    noFill();
    rect(mouse.x - 2, mouse.y - 2, mouse.width + 4, mouse.height + 4);
    noStroke();
  } else {
    stroke(255, 255, 0);
    strokeWeight(3);
    noFill();
    rect(bird.x - 2, bird.y - 2, bird.width + 4, bird.height + 4);
    noStroke();
  }
  strokeWeight(1);
  
  // Game instructions
  fill(0);
  textSize(16);
  text("Press SPACE to switch between Mouse and Bird", 20, 30);
  text("Use arrow keys to move", 20, 55);
  textSize(14);
  
  if (activeCharacter === "mouse") {
    text("Active: MOUSE - Can activate the lever but can't reach the button", 20, 80);
  } else {
    text("Active: BIRD - Can fly to press the button but can't activate the lever", 20, 80);
  }
  
  // Check button press
  if (collides(bird, button) && activeCharacter === "bird") {
    button.pressed = true;
    if (!ball.released) {
      ball.released = true;
    }
  }
  
  // Ball physics
  if (ball.released) {
    // Apply gravity to vertical speed
    ball.ySpeed += ball.gravity;
    ball.y += ball.ySpeed;
    
    // Apply horizontal movement if the ball is rolling
    ball.x += ball.xSpeed;
    
    // Check if ball hits the ground
    if (ball.y + ball.radius >= 520) {
      ball.y = 520 - ball.radius;
      
      if (!ball.grounded) {
        // First time hitting ground
        ball.ySpeed = 0;
        ball.xSpeed = -4; // Start rolling left toward the can
        ball.grounded = true;
      } else {
        // Already grounded - apply friction
        ball.xSpeed *= 0.99;
      }
    }
    
    // Check if ball hits the can
    if (canVisible && circleRectCollision(ball, can)) {
      // Make the can disappear
      canVisible = false;
      
      // Ball bounces slightly
      ball.xSpeed *= -0.5;
      
      // Add a small visual effect (particle would be better but keeping it simple)
      fill(255, 200, 0, 150);
      circle(can.x + can.width/2, can.y + can.height/2, 80);
    }
  }
  
  // Check if mouse can activate lever
  // Only allow mouse to activate lever if can is removed
  if (activeCharacter === "mouse" && 
      collides(mouse, lever) && 
      !leverActivated &&
      !canVisible) { // Can must be gone
    if (keyIsDown(UP_ARROW)) {
      leverActivated = true;
      lever.color = color(0, 255, 0);
    }
  }
  
  // Show lever activation hint
  if (activeCharacter === "mouse" && 
      collides(mouse, lever) && 
      !leverActivated &&
      !canVisible) {
    fill(0);
    text("Press UP ARROW to activate lever", lever.x - 60, lever.y - 10);
  }
  
  // Check win condition
  if (leverActivated && 
      ((activeCharacter === "mouse" && collides(mouse, exit)) || 
       (activeCharacter === "bird" && collides(bird, exit)))) {
    levelComplete = true;
  }
  
  // Display win message
  if (levelComplete) {
    fill(0, 100, 0);
    textSize(32);
    text("Level Complete!", width/2 - 120, height/2);
    textSize(18);
    text("Mouse and Bird worked together to solve the puzzle!", width/2 - 170, height/2 + 40);
  }
  
  // Display can blocking message
  if (canVisible && mouse.x > 300 && mouse.x < can.x && activeCharacter === "mouse") {
    fill(200, 0, 0);
    text("The can is too heavy for the mouse to push!", can.x - 50, can.y - 20);
  }
  
  // Handle movement input
  handleMovement();
}

function handleMovement() {
  let character = activeCharacter === "mouse" ? mouse : bird;
  
  if (keyIsDown(LEFT_ARROW)) {
    character.x -= character.speed;
    
    // Mouse can't push the can
    if (activeCharacter === "mouse" && canVisible && collides(mouse, can)) {
      mouse.x = can.x - mouse.width;
    }
  }
  
  if (keyIsDown(RIGHT_ARROW)) {
    character.x += character.speed;
    
    // Mouse can't push the can
    if (activeCharacter === "mouse" && canVisible && collides(mouse, can)) {
      mouse.x = can.x + can.width;
    }
  }
  
  // Bird can fly, mouse can't
  if (activeCharacter === "bird") {
    if (keyIsDown(UP_ARROW)) {
      bird.y -= bird.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      bird.y += bird.speed;
    }
  } else {
    // Mouse can only move on ground
    mouse.y = 500;
  }
  
  // Keep characters within bounds
  character.x = constrain(character.x, 0, width - character.width);
  character.y = constrain(character.y, 0, 500);
}

function keyPressed() {
  if (key === ' ') {
    // Switch active character
    activeCharacter = activeCharacter === "mouse" ? "bird" : "mouse";
  }
}

function drawCharacter(character, name) {
  fill(character.color);
  rect(character.x, character.y, character.width, character.height, 5);
  
  // Add character details
  if (name === "MOUSE") {
    // Ears
    fill(180, 180, 180);
    circle(character.x + 5, character.y, 6);
    circle(character.x + character.width - 5, character.y, 6);
    
    // Eyes
    fill(0);
    circle(character.x + 5, character.y + 5, 3);
    circle(character.x + character.width - 5, character.y + 5, 3);
    
    // Tail
    stroke(150);
    line(character.x - 10, character.y + 10, character.x, character.y + 8);
    noStroke();
  } else {
    // Bird details
    fill(255, 150, 0);
    triangle(character.x + character.width - 2, character.y + 5, 
             character.x + character.width + 8, character.y + 8, 
             character.x + character.width - 2, character.y + 10);
    
    // Eyes
    fill(0);
    circle(character.x + character.width - 6, character.y + 6, 3);
    
    // Wings
    fill(220, 180, 0);
    ellipse(character.x + 10, character.y + 10, 15, 8);
  }
}

function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

function circleRectCollision(circle, rect) {
  // Find the closest point on the rectangle to the circle
  let closestX = constrain(circle.x, rect.x, rect.x + rect.width);
  let closestY = constrain(circle.y, rect.y, rect.y + rect.height);
  
  // Calculate the distance between the circle's center and the closest point
  let distanceX = circle.x - closestX;
  let distanceY = circle.y - closestY;
  
  // If the distance is less than the circle's radius, there's a collision
  return (distanceX * distanceX + distanceY * distanceY) < (circle.radius * circle.radius);
}
*/
