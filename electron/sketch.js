let pixel1,
  pixel2,
  cat_frame1,
  cat_frame2,
  cat_base,
  cat_eyes1,
  cat_eyes2,
  cat_eyes3,
  cat_eyes4;
let mouse_run1, mouse_run2, bird_fly1, bird_fly2, cat_chaser, mouse, bird, colacan, bird_left, bird_right, board;
let morse;

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

let level2Objects = {
  ballReleased: false,
  levelComplete: false,
  canVisible: true,
  activeCharacter: "mouse",
  can: null,
  button: null,
  ball: null,
  exit: null,
};

let boxes = [];
let bgm, oof;
let pigpen1, pigpen2, pigpen3, pigpen4;
let pigpencode;

let timeData = [];
let totalTime = [];
let lastTimeData = 0;

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

  cat_walk1 = loadImage("../assets/pixil-frame-0.png");
  cat_walk2 = loadImage("../assets/pixil-frame-1.png");
  cat_walk3 = loadImage("../assets/pixil-frame-2.png");
  cat_walk4 = loadImage("../assets/pixil-frame-3.png");
  cat_walk5 = loadImage("../assets/pixil-frame-4.png");
  cat_walk6 = loadImage("../assets/pixil-frame-5.png");
  mouse_left = loadImage("../assets/mouse-vio-left.png");
  mouse_right = loadImage("../assets/mouse-vio-right.png");
  bird = loadImage("../assets/birdieeee.png");

  bird_left = [loadImage("../gameassets/bird_left1.png"), loadImage("../gameassets/bird_left2.png"), loadImage("../gameassets/bird_left3.png")];
  bird_right = [loadImage("../gameassets/bird_right1.png"), loadImage("../gameassets/bird_right2.png"), loadImage("../gameassets/bird_right3.png")];

  oof = loadSound("../assets/oof.mp3");
  colacan = loadImage("../gameassets/colacan-side.png");
  colacan2 = loadImage("../gameassets/colacan-flat.png");
  board = loadImage("../gameassets/board.png")
  bgm = loadSound("../assets/scary_song.mp3");
  bgm.setVolume(0.4);

  pigpen1 = loadImage('../gameassets/PIGPEN1.png');
  pigpen2 = loadImage('../gameassets/PIGPEN2.png');
  pigpen3 = loadImage('../gameassets/PIGPEN3.png');
  pigpen4 = loadImage('../gameassets/PIGPEN4.png');

  pigpencode = loadImage('../gameassets/Pigpencode.png');

  morse = loadImage('../assets/morse.jpg');
  portal = loadImage('../gameassets/portal.png');

  piginapen = loadImage('../gameassets/piginapen.jpeg');

  sunset = loadImage('../gameassets/sunset.jpeg');
  vase = loadImage('../gameassets/vase_deco.png');

  toilet = loadImage('../gameassets/Toilet.png');
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
    mouse_left,
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
    drawLevel2();
  } else if (gameState === "level2morse") {
    drawLevel2Morse();
  } else if (gameState === "level3") {
    drawLevel3();
  } else if (gameState === "gameover") {
    background(0, 0, 0);
    fill(255);
    textSize(30);
    textAlign(CENTER);
    text("(you died)", width / 2, height / 2);
  } else if (gameState === "victory") {
    drawWinScene();
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
  lastTimeData = timerDuration;
  totalTime.push(timerDuration);
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
  timeData.push(currentTime);
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

function saveRun(name = "bird and mouse") {
  let data = 0;
  let total = 0;

  for (let i = 0; i < timeData.length; i++) {
    data += timeData[i];
    total += totalTime[i];
  }

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "https://leaderboard.violetzcandy.com/new", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ player: name, score: Math.floor(data / total * 100) }));
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

let cat_frame = 1;
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

    if (frameCounter < 1) {
      image(mouse_run1, anim_mouseX, 400, 96, 72);
      image(bird_fly1, anim_birdX, 200, 120, 120);
    } else {
      image(mouse_run2, anim_mouseX, 400, 96, 72);
      image(bird_fly2, anim_birdX, 200, 120, 120);
    }

    if (frameCount % 5 === 0) {
      cat_frame++;
      if (cat_frame > 6) {
        cat_frame = 1;
      }
    }
    image(window[`cat_walk${cat_frame}`], anim_catX, 280, 280, 200);

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
    image(mouse_left, 185, 240, 220, 190);
  } else {
    image(bird_left[0], 200, 240, 200, 200);
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
    image(mouse_right, 800, 240, 220, 190);
  } else {
    image(bird_right[0], 800, 240, 200, 200);
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

let wasd, arrowkey;
function updatePlayerControls() {

  // Player 1 (WASD)
  if (selectedCharacter1 === "mouse") {
    mousePlayer = new Player(200, 100, mouse_left, true, 87, 83, 65, 68, 80, 80); // W,S,A,D
    wasd = "mouse";
  } else {
    birdPlayer = new Player(100, 100, bird, false, 87, 83, 65, 68, 150, 150); // W,S,A,D
    wasd = "bird";
  }

  // Player 2 (Arrow Keys)
  if (selectedCharacter2 === "mouse") {
    mousePlayer = new Player(
      200,
      100,
      mouse_left,
      true,
      UP_ARROW,
      DOWN_ARROW,
      LEFT_ARROW,
      RIGHT_ARROW,
      80,
      80
    );
    arrowkey = "mouse";
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
    arrowkey = "bird";
  }
}

let c = 0;
let last_key = "left"
function updateBirdImg(birdP, frame) {
  if (frame % 10 == 0) { c == bird_left.length - 1 ? c = 0 : c++; }
  if ((arrowkey == "bird" && keyIsDown(LEFT_ARROW)) || (wasd == "bird" && keyIsDown(68))) {
    last_key = "left"
  }
  if ((arrowkey == "bird" && keyIsDown(RIGHT_ARROW)) || (wasd == "bird" && keyIsDown(68))) {
    last_key = "right"
  }
  if (last_key == "left") {
    birdP.img = bird_left[c]
  } else {
    birdP.img = bird_right[c]
  }
}

function updateMouseDir(mouseP) {
  if ((arrowkey == "mouse" && keyIsDown(LEFT_ARROW)) || (wasd == "mouse" && keyIsDown(65))) {
    mouseP.img = mouse_left;
  }
  if ((arrowkey == "mouse" && keyIsDown(RIGHT_ARROW)) || (wasd == "mouse" && keyIsDown(68))) {
    mouseP.img = mouse_right;

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

  // Platforms
  boxes.push(new boxItem(200, height - 200, 200, 30, color(100, 70, 50)));
  boxes.push(new boxItem(600, height - 300, 200, 30, color(100, 70, 50)));

  if (!doorUnlocked) {
    boxes.push(
      new boxItem(width - 50, height - 200, 50, 200, color(160, 82, 45))
    );
  }

  // Floor
  boxes.push(new boxItem(0, height - 20, width, 30, color(100, 50, 50)));

  mouseBlockIndex = boxes.length;
  mouseBlock = new boxItem(-50, 500, 200, 150, color(0, 180, 0, 0));
  boxes.push(mouseBlock);
  image(board, -50, 500, 200, 150);

  buttonW = 80;
  buttonH = 30;
  buttonX = 250;
  buttonY = height - 200 - buttonH - 10;

  newButtonW = 80;
  newButtonH = 30;
  newButtonX = width - 100;
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
    drawLevel1Prop();
    if (doorUnlocked) {
      fill(0, 255, 0);
      textSize(30);
      text("Level 2 ->", width - 100, 300);
      if (mousePlayer.x > width && birdPlayer.x > width) {
        console.log("Starting level 2");
        gameState = "level2";
        doorUnlocked = false;
        counter = 0;
        if (mousePlayer.x > width && birdPlayer.x > width) {
          console.log("Transitioning to level 2");
          gameState = "level2";
          counter = 0; // Reset counter for level 2 setup
          doorUnlocked = false;
        }
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

    if (mousePlayer.y > 2000) {
      mousePlayer.x = 200;
      mousePlayer.y = 100;
    }

    mousePlayer.show();
    mousePlayer.move(boxes);

    updateBirdImg(birdPlayer, counter);
    updateMouseDir(mousePlayer);

    birdPlayer.show();
    birdPlayer.move(boxes);
  } else {
    fill(0);
    textSize(50);
    text("Level 1", width / 2, height / 2);
  }
}

function drawLevel1Prop() {
  image(sunset, 260, 20, 300, 300)

  image(vase, 670, 205, 200, 200)
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
  updateMouseDir(mousePlayer);
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
    image(board, -50, 500, 200, 150);
    if (mouseBlockIndex === -1) {
      mouseBlock = new boxItem(-50, 500, 200, 150, color(0, 180, 0, 0));
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
    fill(255, 182, 193);
  else if (buttonActivated) fill(139, 0, 0);
  else fill(255, 0, 0);
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
    rect(this.x, this.y, this.w, this.h);
  }
}

let canBoxIndex = -1;
let ballTouching = false;
let canBlock = null;
let canGone = false;
let showColacan = false;

function setupLevel2() {
  boxes = [];

  // Floor
  boxes.push(new boxItem(580, height - 80, width, 80, color(100, 70, 50)));

  //Platform 1 (obby)
  boxes.push(new boxItem(10, height - 300, 150, 30, color(100, 70, 50)));
  // Platform 2 (obby)
  boxes.push(new boxItem(280, height - 370, 130, 30, color(100, 70, 50)));

  // Last platform
  boxes.push(new boxItem(830, height - 320, 200, 30, color(100, 70, 50)));

  // Define level objects
  level2Objects = {
    ballReleased: false,
    levelComplete: false,
    newRoomSpawned: false,
    button: {
      x: 870,
      y: height - 330,
      width: 40,
      height: 10,
      pressed: false,
      color: color(255, 0, 0),
    },
    exit: {
      x: width - 80,
      y: height - 260,
      width: 60,
      height: 120,
      color: color(100, 100, 100),
    }
  };

  // Add initial red canBox
  canBlock = new boxItem(750, height - 200, 100, 150, color(200, 0, 0));
  boxes.push(canBlock);
  canBoxIndex = boxes.length - 1;

  // Player starting positions
  mousePlayer.x = 100;
  mousePlayer.y = height - 500;
  birdPlayer.x = 100;
  birdPlayer.y = height - 550;

  mousePlayer.show();
  mousePlayer.move(boxes);
  birdPlayer.show();
  birdPlayer.move(boxes);

  level2Objects.ball = {
    x: 870,
    y: height - 380,
    radius: 15,
    released: false,
    ySpeed: 0,
    xSpeed: 0,
    gravity: 0.3,
    color: color(50, 50, 200),
    grounded: false,
    rolling: false
  };
}

function spawnBall() {
  if (!level2Objects.ball || !level2Objects.ball.released) {
    level2Objects.ball = {
      x: level2Objects.button.x + level2Objects.button.width,
      y: level2Objects.button.y - 50,
      radius: 15,
      released: true,
      ySpeed: 0,
      xSpeed: 0,
      gravity: 0.5,
      color: color(50, 50, 200),
      grounded: false,
      rolling: false
    };
    level2Objects.ballReleased = true;
  }
}

function moveBall() {
  if (!level2Objects.ball || !level2Objects.ballReleased) return;

  let ball = level2Objects.ball;

  if (!ball.grounded) {
    ball.ySpeed += ball.gravity;
    ball.y += ball.ySpeed;
  }

  ball.grounded = false;

  if (ball.y + ball.radius >= height - 80) {
    ball.y = height - 80 - ball.radius;
    ball.ySpeed = 0;
    ball.grounded = true;
    ball.rolling = true;
  }

  if (ball.rolling) {
    ball.x -= 4;

    if (ball.x < 850) {
      if (canBoxIndex >= 0 && canBoxIndex < boxes.length) {
        boxes.splice(canBoxIndex, 1);
        canBoxIndex = -1;
        canGone = true;
        showColacan = true;
        console.log("Box destroyed!");
      }

      level2Objects.ballReleased = false;
      level2Objects.ball = null;
    }
  }
}

function drawLevel2() {
  if (counter === 100) {
    setupLevel2();
    resetTimer();
    startTimer();
  }

  if (counter > 100) {
    background(230, 238, 255);

    // Draw platforms
    for (let box of boxes) {
      box.show();
    }

    if (!canGone) {
      image(colacan, 740, height - 220, 120, 180);
    }

    if (showColacan) {
      image(colacan2, 740, height - 220, 120, 180);
    }

    checkPlayerButtonCollision();

    fill(level2Objects.button.pressed ? color(150, 0, 0) : level2Objects.button.color);
    rect(level2Objects.button.x, level2Objects.button.y, level2Objects.button.width * 2, level2Objects.button.height * 2);

    if (level2Objects.ballReleased && level2Objects.ball) {
      fill(level2Objects.ball.color);
      circle(
        level2Objects.ball.x,
        level2Objects.ball.y,
        level2Objects.ball.radius * 2
      );
      moveBall();
    }

    fill(level2Objects.exit.color);
    rect(level2Objects.exit.x, level2Objects.exit.y, level2Objects.exit.width * 1.5, level2Objects.exit.height * 1.5);


    if (!level2Objects.newRoomSpawned && mousePlayer.x > width && birdPlayer.x > width) {
      level2Objects.newRoomSpawned = true;
      boxes.push(new boxItem(0, height - 80, width, 80, color(100, 70, 50)));
    }

    if (mousePlayer.y > 2000) {
      mousePlayer.x = 100;
      mousePlayer.y = height - 500;
    }

    mousePlayer.show();
    mousePlayer.move(boxes);
    checkCollision(mousePlayer);

    updateBirdImg(birdPlayer, counter);
    updateMouseDir(mousePlayer);

    birdPlayer.show();
    birdPlayer.move(boxes);
    checkCollision(birdPlayer);

    checkPlayerExitCollision();

    updateTimer();
    drawTimer();
  } else {
    fill(0);
    textSize(50);
    text("Level 2", width / 2, height / 2);
  }
}

function checkPlayerExitCollision() {
  const exit = level2Objects.exit;
  const players = [mousePlayer, birdPlayer];

  for (let player of players) {
    if (
      mousePlayer.x < exit.x + exit.width * 1.5 &&
      mousePlayer.x + mousePlayer.width > exit.x &&
      mousePlayer.y < exit.y + exit.height * 1.5 &&
      mousePlayer.y + player.height > exit.y
    ) {
      gameState = "level2morse";
      timerDuration = 210; // 5 min
      resetTimer();
      startTimer();
      setupLevel2Morse();
      return;
    }
  }
}

if (level2Objects.ballReleased && level2Objects.ball) {
  fill(level2Objects.ball.color);
  circle(
    level2Objects.ball.x,
    level2Objects.ball.y,
    level2Objects.ball.radius * 2
  );

  moveBall();
}

function constrain(value, min, max) {
  return value < min ? min : (value > max ? max : value);
}

// Add this helper function if not exists
function dist(x1, y1, x2, y2) {
  return sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function checkPlayerButtonCollision() {
  let players = [mousePlayer, birdPlayer];
  let buttonPressed = false;

  for (let player of players) {
    if (player.x + player.width > level2Objects.button.x &&
      player.x < level2Objects.button.x + level2Objects.button.width * 2 &&
      player.y + player.height > level2Objects.button.y &&
      player.y < level2Objects.button.y + level2Objects.button.height * 2) {
      buttonPressed = true;
      break;
    }
  }

  // Only spawn ball when button is first pressed
  if (buttonPressed && !level2Objects.button.pressed) {
    level2Objects.button.pressed = true;
    spawnBall();
  } else if (!buttonPressed) {
    level2Objects.button.pressed = false;
  }
}

let showBigImage1 = false;
let showBigImage2 = false;
let showBigImage3 = false;
let showBigImage4 = false;
let imageHitbox1 = { x: 130, y: 310, w: 100, h: 100 };
let imageHitbox2 = { x: 400, y: 20, w: 100, h: 100 };
let imageHitbox3 = { x: 800, y: 150, w: 100, h: 100 };
let imageHitbox4 = { x: 1000, y: 480, w: 100, h: 100 };
let bigImageX = 300;
let bigImageY = 300;
let closeButtonSize = 30;
let keypadBox = { x: 1100, y: 300, w: 100, h: 100 };
let showKeypad = false;
let codeInput, submitButton;

let hinttxt2 = "Left to right!";

function setupLevel2Morse() {
  boxes = [];

  updatePlayerControls();

  // Floor
  boxes.push(new boxItem(0, height - 80, width, 80, color(100, 70, 50)));

  mousePlayer.x = 100;
  mousePlayer.y = height - 210;
  birdPlayer.x = 100;
  birdPlayer.y = height - 250;

  mousePlayer.velocity = 0;
  birdPlayer.velocity = 0;
}

let keys = [];
let seedX = [];
let seedY = [];
let lastinput;

function findSequence(array, sequence) {
  for (let i = 0; i <= array.length - sequence.length; i++) {
    let match = true;
    for (let j = 0; j < sequence.length; j++) {
      if (array[i + j] !== sequence[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      return i;
    }
  }
  return -1;
}

function drawLevel2Morse() {
  console.log("DRAW LEVEL 2 MORSE");

  if (counter === 100) {
    setupLevel2Morse();
    resetTimer();
    startTimer();
    counter++;
  }

  if (counter > 100) {
    background(230, 238, 255);

    for (let i = 0; i < keys.length; i++) {
      fill(100, 0, 0);
      text(keys[i], seedX[i], seedY[i]);
    }

    // Draw platforms
    for (let box of boxes) {
      box.show();
    }

    image(pigpencode, 400, 300, 500, 200);

    fill(0, 0, 0);
    textSize(20);
    text(hinttxt2, 200, 70);

    image(pigpen1, 130, 310, 100, 100);
    image(pigpen2, 400, 20, 100, 100);
    image(pigpen3, 800, 150, 100, 100);
    image(pigpen4, 1000, 480, 100, 100);

    image(piginapen, 1100, 0, 100, 100);

    updateBirdImg(birdPlayer, counter);
    updateMouseDir(mousePlayer);

    if (mousePlayer > 2000) {
      mousePlayer.x = 100;
      mousePlayer.y = height - 210;
    }

    mousePlayer.show();
    mousePlayer.move(boxes);
    checkCollision(mousePlayer);

    birdPlayer.show();
    birdPlayer.move(boxes);
    checkCollision(birdPlayer);

    /*
    if (!showBigImage1) {
      image(pigpen1, imageHitbox1.x, imageHitbox1.y, imageHitbox1.w, imageHitbox1.h);

      if (
        checkPlayerTouchingImage(mousePlayer, imageHitbox1) ||
        checkPlayerTouchingImage(birdPlayer, imageHitbox1)
      ) {
        showBigImage1 = true;
      }
    } else {
      let bigW = 700;
      let bigH = 600;
      let centerX = width / 2 - bigW / 2;
      let centerY = height / 2 - bigH / 2;

      image(pigpen1, centerX, centerY, bigW, bigH);

      fill(255, 0, 0);
      rect(centerX + bigW - 20, centerY - 20, closeButtonSize, closeButtonSize, 5);
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("X", centerX + bigW - 20 + closeButtonSize / 2, centerY - 20 + closeButtonSize / 2);

      if (
        mouseIsPressed &&
        mouseX > centerX + bigW - 20 &&
        mouseX < centerX + bigW - 20 + closeButtonSize &&
        mouseY > centerY - 20 &&
        mouseY < centerY - 20 + closeButtonSize
      ) {
        showBigImage1 = false;
      }
    }

    // --- PIGPEN 2 ---
    if (!showBigImage2) {
      image(pigpen2, imageHitbox2.x, imageHitbox2.y, imageHitbox2.w, imageHitbox2.h);

      if (
        checkPlayerTouchingImage(mousePlayer, imageHitbox2) ||
        checkPlayerTouchingImage(birdPlayer, imageHitbox2)
      ) {
        showBigImage2 = true;
      }
    } else {
      let bigW = 700;
      let bigH = 600;
      let centerX = width / 2 - bigW / 2;
      let centerY = height / 2 - bigH / 2;

      image(pigpen2, centerX, centerY, bigW, bigH);

      fill(255, 0, 0);
      rect(centerX + bigW - 20, centerY - 20, closeButtonSize, closeButtonSize, 5);
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("X", centerX + bigW - 20 + closeButtonSize / 2, centerY - 20 + closeButtonSize / 2);

      if (
        mouseIsPressed &&
        mouseX > centerX + bigW - 20 &&
        mouseX < centerX + bigW - 20 + closeButtonSize &&
        mouseY > centerY - 20 &&
        mouseY < centerY - 20 + closeButtonSize
      ) {
        showBigImage2 = false;
      }
    }

    //PIGPEN 3
    if (!showBigImage3) {
      image(pigpen3, imageHitbox3.x, imageHitbox3.y, imageHitbox3.w, imageHitbox3.h);

      if (
        checkPlayerTouchingImage(mousePlayer, imageHitbox3) ||
        checkPlayerTouchingImage(birdPlayer, imageHitbox3)
      ) {
        showBigImage3 = true;
      }
    } else {
      let bigW = 700;
      let bigH = 600;
      let centerX = width / 2 - bigW / 2;
      let centerY = height / 2 - bigH / 2;

      image(pigpen3, centerX, centerY, bigW, bigH);

      fill(255, 0, 0);
      rect(centerX + bigW - 20, centerY - 20, closeButtonSize, closeButtonSize, 5);
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("X", centerX + bigW - 20 + closeButtonSize / 2, centerY - 20 + closeButtonSize / 2);

      if (
        mouseIsPressed &&
        mouseX > centerX + bigW - 20 &&
        mouseX < centerX + bigW - 20 + closeButtonSize &&
        mouseY > centerY - 20 &&
        mouseY < centerY - 20 + closeButtonSize
      ) {
        showBigImage3 = false;
      }
    }

    if (!showBigImage4) {
      image(pigpen4, imageHitbox4.x, imageHitbox4.y, imageHitbox4.w, imageHitbox4.h);

      if (
        checkPlayerTouchingImage(mousePlayer, imageHitbox4) ||
        checkPlayerTouchingImage(birdPlayer, imageHitbox4)
      ) {
        showBigImage4 = true;
      }
    } else {
      let bigW = 700;
      let bigH = 600;
      let centerX = width / 2 - bigW / 2;
      let centerY = height / 2 - bigH / 2;

      image(pigpen4, centerX, centerY, bigW, bigH);

      fill(255, 0, 0);
      rect(centerX + bigW - 20, centerY - 20, closeButtonSize, closeButtonSize, 5);
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("X", centerX + bigW - 20 + closeButtonSize / 2, centerY - 20 + closeButtonSize / 2);

      if (
        mouseIsPressed &&
        mouseX > centerX + bigW - 20 &&
        mouseX < centerX + bigW - 20 + closeButtonSize &&
        mouseY > centerY - 20 &&
        mouseY < centerY - 20 + closeButtonSize
      ) {
        showBigImage4 = false;
      }
    }
      */

    // Draw keypad box
    /*
    fill(200, 150, 255);
    rect(keypadBox.x, keypadBox.y, keypadBox.w, keypadBox.h);
    fill(0);
    textSize(14);
    textAlign(CENTER, CENTER);
    text("Enter Code", keypadBox.x + keypadBox.w / 2, keypadBox.y + keypadBox.h / 2);

    // If player touches it, show input + button
    if (!showKeypad && (
      checkPlayerTouchingImage(mousePlayer, keypadBox) ||
      checkPlayerTouchingImage(birdPlayer, keypadBox)
    )) {
      showKeypad = true;

      // Create input box
      codeInput = createInput();
      codeInput.position(keypadBox.x, keypadBox.y + 110);
      codeInput.size(100);

      // Create submit button
      submitButton = createButton('Submit');
      submitButton.position(keypadBox.x, keypadBox.y + 140);
      submitButton.mousePressed(() => {
        if (codeInput.value() === "ESCAPE") {
          console.log("correct");
        } else {
          console.log("wrong code");
        }
        codeInput.remove();
        submitButton.remove();
        showKeypad = false;
      });
    }*/

    if (keyIsPressed) {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', lastinput].includes(key)) {
        keys.push(key);
        seedX.push(width * Math.random());
        seedY.push(height * Math.random());
        lastinput = key;

        if (findSequence(keys, ['e', 's', 'c', 'a', 'p', 'e']) !== -1) {
          console.log("ESCAPE");
          gameState = "level3";
          counter = 0;
        }
      }
    }

    checkPlayerButtonCollision();
    updateTimer();
    drawTimer();
  } else {
    fill(0);
    textSize(50);
    text("Level 2 Morse Code", width / 2, height / 2);
  }
}

let code = ".-. ..- -."; //run
let mI = code.length;
let mTimer = 0;
let flash = false;
let osc = 20;
let dirUp = true;

function morseFlasher(x, y) {
  let dot = 10;
  let dash = 60;
  let space = 30;
  let gap = 100;

  if (mI > code.length - 1) {
    if (mTimer < 200) {
      flash = false;
    } else {
      mI = 0;
      mTimer = 0;
      flash = false;
    }
  }

  if (code[mI] === ".") {
    if (mTimer < dot) {
      flash = true;
    } else if (mTimer < dot + space) {
      flash = false;
    } else {
      mI++;
      mTimer = 0;
    }
  } else if (code[mI] === "-") {
    if (mTimer < dash) {
      flash = true;
    } else if (mTimer < dash + space) {
      flash = false;
    } else {
      mI++;
      mTimer = 0;
    }
  } else if (code[mI] === " ") {
    if (mTimer < gap) {
      flash = false;
    } else {
      mI++;
      mTimer = 0;
    }
  }

  fill(0);
  circle(x, y, 70);

  fill(255, 0, 0);
  circle(x, y, 60);
  noStroke();
  if (flash) {
    fill(255, 100, 100);
    circle(x, y, 30);
  } else {
    fill(100, 0, 0);
    circle(x, y, 30);
  }

  mTimer++;
}

function drawLevel3Prop() {

  push();
  translate(500, 150);
  rotate(sin(frameCount / 60) / osc);
  image(morse, -80, 0, 150, 180);
  pop();

  image(portal, portalX, portalY, 29 * 8, 54 * 8);
  if (dirUp) {
    portalY += 0.1;
  } else {
    portalY -= 0.1;
  }

  if (dirUp && portalY > 120) {
    dirUp = false;
  } else if (!dirUp && portalY < 100) {
    dirUp = true;
  }

  image(toilet, -40, 230, 400, 400)
  image(toilet, 280, 230, 400, 400)
  image(toilet, 550, 230, 400, 400)
}

let doorX = [-10, 300, 610, 920];
let door4unlocked = false;
let door4opened = false;
let input = "";
let triggerInput = false;
let s = true;
let door4c = [255, 0, 0];

let portalX = 970;
let portalY = 110;

function checkForTrigger() {
  if (collideRectRect(
    birdPlayer.x,
    birdPlayer.y,
    birdPlayer.width,
    birdPlayer.height,
    doorX[2] + 50,
    110,
    200 - birdPlayer.width,
    100
  ) && s) { triggerInput = true; } else { triggerInput = false; }

  if (!triggerInput) {
    fill(160, 60, 20);
    rect(doorX[2] + 50, 110, 200, 100);

    fill(255);
    textSize(20);
    text("listen. to...", doorX[2] + 150, 160);
  }

}

function enterKey() {
  rectMode(CENTER);
  fill(255);
  rect(width / 2, height / 2, 400, 300);
  rect(width / 2, height / 2 + 100, 150, 50);

  fill(0);
  text("Enter", width / 2, height / 2 + 100);

  fill(255, 0, 0);
  text(input, width / 2, height / 2 - 50);

  rectMode(CORNER);
}

let inputCooldown = 0;
function detectInput() {
  if (keyIsPressed && inputCooldown <= 0) {
    if (keyCode === BACKSPACE) {
      input = input.slice(0, -1);
      inputCooldown = 15;
    } else if (![87, 83, 65, 68] == keyCode) {
      inputCooldown = 15;
    } else if (keyCode === ENTER) {
      if (input.toLowerCase() === "run") {
        door4unlocked = true;
        input = "";
        s = false;
        door4c = [0, 180, 0];
      } else {
        input = "wrong code!";
        inputCooldown = 30;
      }
      inputCooldown = 30;
    } else if (key.length === 1) {
      input += key;
      inputCooldown = 15;
    }
  }

  if (inputCooldown > 0) {
    inputCooldown--;
  } else if (input === "wrong code!") {
    input = "";
  }
}

function drawDoor() {
  for (i = 0; i < 4; i++) {
    fill(100, 50, 50);
    if (detectDoor(i) && (door4unlocked || i != 3)) {
      rect(doorX[i], 80, 80, 490);
      if (door4unlocked && i == 3) {
        door4opened = true;
        osc = 4;
      }
    } else {
      if (door4opened) {
        rect(doorX[3], 80, 80, 490);
        rect(doorX[i], 80, 80, 490);
      } else {
        fill(100, 50, 50);
        rect(doorX[i], 80, 290, 490);

        i == 3 ? fill(door4c[0], door4c[1], door4c[2]) : fill(255);
        rect(doorX[i] + 110, 120, 70, 70);

        textSize(30);
        fill(0);
        text(i + 1, doorX[i] + 145, 155);
      }
    }
  }

  if (!door4unlocked && detectDoor(3)) {
    fill(0);
    text("this door is locked!", width / 2, 30);
  }

  fill(150, 75, 75);
  rect(280, 80, 20, 520);
  rect(590, 80, 20, 520);
  rect(900, 80, 20, 520);
}

function detectDoor(door) {
  return collideRectRect(
    birdPlayer.x,
    birdPlayer.y,
    birdPlayer.width,
    birdPlayer.height,
    doorX[door],
    80,
    290 - birdPlayer.width,
    490
  )
}

function setupLevel3() {
  boxes = [];
  boxes.push(new boxItem(0, height - 80, width, 80, color(100, 70, 50)));

  mousePlayer.x = 100;
  mousePlayer.y = 200;
  birdPlayer.x = 300;
  birdPlayer.y = 100;
}

function drawLevel3() {
  if (counter === 100) {
    setupLevel3();
    resetTimer();
    startTimer();
  }

  if (counter > 100) {
    background(200, 220, 255);

    checkForTrigger();

    drawLevel3Prop();
    morseFlasher(150, 150);
    drawDoor(2);

    for (let box of boxes) {
      box.show();
    }

    updateBirdImg(birdPlayer, counter);
    updateMouseDir(mousePlayer);

    if (mousePlayer.y > 2000) {
      mousePlayer.x = 100;
      mousePlayer.y = height - 200;
    }

    mousePlayer.show();
    mousePlayer.move(boxes);

    birdPlayer.show();
    birdPlayer.move(boxes);

    if (triggerInput) {
      detectInput();
      enterKey();
    }

    if (collideRectRect(
      birdPlayer.x,
      birdPlayer.y,
      birdPlayer.width,
      birdPlayer.height,
      portalX,
      portalY,
      29 * 8,
      54 * 8
    ) && collideRectRect(
      mousePlayer.x,
      mousePlayer.y,
      mousePlayer.width,
      mousePlayer.height,
      portalX,
      portalY,
      29 * 8,
      54 * 8
    )) {
      console.log("win");
      gameState = "victory";
      saveRun();
    }

    updateTimer();
    drawTimer();
  } else {
    fill(0);
    textSize(50);
    text("Level 3", width / 2, height / 2);
  }
}

let o = 0;
function drawWinScene() {
  background(0, 0, 0, o);

  if (o < 255) {
    o += 5;
    if (o > 255) o = 255;
  } else {
    fill(255);
    textSize(50);
    text("YOU WIN!", width / 2, height / 2);
  }
}

function checkPlayerTouchingImage(player, imageHitbox) {
  return (
    player.x < imageHitbox.x + imageHitbox.w &&
    player.x + player.width > imageHitbox.x &&
    player.y < imageHitbox.y + imageHitbox.h &&
    player.y + player.height > imageHitbox.y
  );
}


function checkCollision(player) {
  for (let box of boxes) {
    resolveCollision(player, box);
  }
}

function resolveCollision(player, obj) {
  if (obj.passThrough) return; // NEW: Skip collision if passThrough

  if (
    player.x + player.width > obj.x &&
    player.x < obj.x + obj.width &&
    player.y + player.height > obj.y &&
    player.y < obj.y + obj.height
  ) {
    let fromTop = player.y + player.height - player.ySpeed <= obj.y;
    let fromBottom = player.y - player.ySpeed >= obj.y + obj.height;
    let fromLeft = player.x + player.width - player.xSpeed <= obj.x;
    let fromRight = player.x - player.xSpeed >= obj.x + obj.width;

    if (fromTop) {
      player.y = obj.y - player.height;
      player.ySpeed = 0;
    } else if (fromBottom) {
      player.y = obj.y + obj.height;
      player.ySpeed = 0;
    } else if (fromLeft) {
      player.x = obj.x - player.width;
    } else if (fromRight) {
      player.x = obj.x + obj.width;
    }
  }
}