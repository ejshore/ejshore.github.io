let bg, holdenLeft, holdenRight, holdenCatchLeft, holdenCatchRight, holdenCryLeft, holdenCryRight, duck, boulder;
let holden = {};
let velocity = 0;
const width = 800;
const height = 500;
let projectiles = [];
let safeUp = [];
let safe = [];
let dead = [];
const projTypes = ['kid', 'rock', 'duck'];
let kidImages = [];
let one = false;
let landings = [
  [400, 360],
  [450, 360],
  [500, 360],
  [550, 360],
  [600, 360],
  [660, 360],
  [700, 360],
  [770, 360]
];
const animationLength = 1.2;
const gravity = 9.81e2 / animationLength ** 2;
let die_vel = 3;
let safe_vel = 3;
let deaths = 0;
let most = 0;
let menuScreen = false;
let score = 0;
let end_score = 0;
let catching = false;

function preload() {
  bg = loadImage('assets/background.png');
  holdenLeft = loadImage('assets/HoldenLeft.png');
  holdenRight = loadImage('assets/HoldenRight.png');
  holdenCatchLeft = loadImage('assets/HoldenCatchLeft.png');
  holdenCatchRight = loadImage('assets/HoldenCatchRight.png');
  holdenCryLeft = loadImage('assets/HoldenCryLeft.png');
  holdenCryRight = loadImage('assets/HoldenCryRight.png');
  duck = [loadImage('assets/Duck.png'), loadImage('assets/DeadDuck.png')];
  boulder = [loadImage('assets/Boulder.png')];
  kidImages.push([loadImage('assets/SadKidOne.png'), loadImage('assets/HappyKidOne.png'), loadImage('assets/DeadKidOne.png')]);
  kidImages.push([loadImage('assets/SadKidTwo.png'), loadImage('assets/HappyKidTwo.png'), loadImage('assets/DeadKidOne.png')]);
  kidImages.push([loadImage('assets/SadKidThree.png'), loadImage('assets/HappyKidThree.png'), loadImage('assets/DeadKidOne.png')]);
}

function setup() {
  mn = createGraphics(width, height);
  createCanvas(width, height);
  toggleMenu();
  holden = { x: 400, y: 360, img: holdenLeft };
}

function Projectile(x, y, start_x, start_y, end_x, end_y, startingVelocity, splat, what, img) {
  this.x = x;
  this.y = y;
  this.start_x = start_x;
  this.start_y = start_y;
  this.end_x = end_x;
  this.end_y = end_y;
  this.startingVelocity = startingVelocity;
  this.splat = splat;
  this.what = what;
  this.img = img;
}

function changeVelocity() {
  if (mouseX < holden.x + 80 && mouseX > holden.x + 20) {
    velocity = 0;
  } else if (mouseX <= holden.x && velocity == 10) {
    velocity -= 12;
    if (holden.img == holdenCatchLeft || holden.img == holdenCatchRight) {
      holden.img = holdenCatchLeft;
    } else if (holden.img == holdenCryLeft || holden.img == holdenCryRight) {
      holden.img = holdenCryLeft;
    } else {
      holden.img = holdenLeft;
    }
  } else if (mouseX > holden.x + 100 && velocity == -10) {
    velocity += 12;
    if (holden.img == holdenCatchLeft || holden.img == holdenCatchLeft) {
      holden.img = holdenCatchRight;
    } else if (holden.img == holdenCryLeft || holden.img == holdenCryRight) {
      holden.img = holdenCryRight;
    } else {
      holden.img = holdenRight;
    }
  } else if (mouseX <= holden.x && velocity > -10) {
    velocity -= 1;
    if (holden.img == holdenCatchLeft || holden.img == holdenCatchRight) {
      holden.img = holdenCatchLeft;
    } else if (holden.img == holdenCryLeft || holden.img == holdenCryRight) {
      holden.img = holdenCryLeft;
    } else {
      holden.img = holdenLeft;
    }
  } else if (mouseX > holden.x + 100 && velocity < 10) {
    velocity += 1;
    if (holden.img == holdenCatchLeft || holden.img == holdenCatchLeft) {
      holden.img = holdenCatchRight;
    } else if (holden.img == holdenCryLeft || holden.img == holdenCryRight) {
      holden.img = holdenCryRight;
    } else {
      holden.img = holdenRight;
    }
  }
}

function getRandomNum(min, max) {
  return Math.random() * (max - min) + min;
}

function newProjectile() {
  let img;
  let rd = Math.floor(getRandomNum(0, 30));
  if (rd <= 27) {
    img = kidImages[Math.floor(getRandomNum(0, 3))];
    rd = 0;
  } else if (rd == 28) {
    img = boulder;
    rd = 1;
  } else if (rd == 29) {
    img = duck;
    rd = 2;
  }
  let what = projTypes[rd];
  let x = 0;
  let y = height / 6;
  let end = [getRandomNum(250, 700), 360];
  if (one) {
    while (end[0] + 150 > holden.x && end[0] < holden.x + 200) {
      end = [getRandomNum(250, 700), 360];
    }
  }

  projectiles.push(new Projectile(x, y, x, y, end[0], end[1], calculateStartingVelocity(x, y, end[0], end[1]), false, what, img));
}

function calculateStartingVelocity(start_x, start_y, end_x, end_y) {
  const deltaPosition = {
    x: end_x - start_x,
    y: end_y - start_y,
  }
  return {
    x: deltaPosition.x / animationLength,
    y: deltaPosition.y / animationLength - gravity * animationLength / 2,
  };
}

function drawProjectiles() {
  for (const projectile of projectiles) {
    if (projectile.y >= height/2 && (projectile.x + 100 > holden.x && projectile.x < holden.x + 100)) {
      if (projectile.what == 'rock') {
        deaths++;
        dead.push(projectile);
        projectiles = projectiles.filter(function(el) { return el != projectile; });
        continue;
      }
      score += 1;
      if (projectile.what == 'duck') {
        safe_vel = 3;
        die_vel = 3;
        if (deaths > 0) {
          deaths -= 1;
        }
      } else {
        safe_vel += 0.5;
        die_vel += 0.1;
      }
      safeUp.push(projectile);
      projectiles = projectiles.filter(function(el) { return el != projectile; });
      continue;
    } else if (projectile.y >= 360) {
      projectile.y = 360;
      dead.push(projectile);
      deaths++;
      projectiles = projectiles.filter(function(el) { return el != projectile; });
      continue;
    }
    if (!projectile.startTime) projectile.startTime = performance.now();
    const deltaSeconds = (performance.now() - projectile.startTime) / 1000;
    projectile.x = projectile.start_x + projectile.startingVelocity.x * deltaSeconds;
    projectile.y = projectile.start_y + projectile.startingVelocity.y * deltaSeconds + 0.5 * gravity * deltaSeconds ** 2;
    image(projectile.img[0], projectile.x, projectile.y, 100, 120);
  }
  for (const kid of safeUp) {
    if (kid.y > 360) {
      kid.y = 360;
      safe.push(kid);
      safeUp = safeUp.filter(function(el) { return el != kid; });
      continue;
    }
    kid.y += 3;
    kid.x = holden.x;
    image(kid.img[0], kid.x, kid.y, 100, 120);
  }
  for (const kid of safe) {
    if (kid.x >= 910) {
      safe = safe.filter(function(el) { return el != kid; });
      newProjectile();
      continue;
    }
    kid.x += safe_vel;
    if (kid.what == "kid") {
      image(kid.img[1], kid.x, kid.y, 100, 120);
    } else {
      image(kid.img[0], kid.x, kid.y, 100, 120);
    }
  }
  for (const kid of dead) {
    if (kid.y >= 510) {
      dead = dead.filter(function(el) { return el != kid; });
      newProjectile();
      continue;
    }
    kid.y += die_vel;
    if (kid.what == "duck") {
      image(kid.img[1], kid.x, kid.y, 100, 120);
    } else if (kid.what == "kid") {
      image(kid.img[2], kid.x, kid.y, 100, 120);
    } else {
      image(kid.img[0], kid.x, kid.y, 100, 120);
    }
  }
}

function menu() {
  if (deaths == 3) {
    deaths = 0;
    projectiles = [];
    safeUp = [];
    safe = [];
    dead = [];
    one = false;
    end_score = score;
    score = 0;
    velocity = 0;
    die_vel = 3;
    safe_vel = 3;
  }
  mn.strokeWeight(0);
  mn.fill(0, 0, 0, 200);
  mn.rectMode(RADIUS);
  mn.rect(width/2, height/2, width/2 - 40, height/2 - height/11);
  mn.textSize(50);
  mn.textAlign(CENTER, CENTER);
  mn.fill(255);
  mn.textStyle(BOLD);
  mn.text("Press any button to play", width/2, height/4.5);
  mn.textStyle();
  mn.textSize(30);
  mn.text("1. Press any button to pause.", width/2, height/2.5 - 40);
  mn.text("2. The more points you get, the faster kids jump.", width/2, height/2.5);
  mn.text("3. Every time a kid dies or you get hit by a rock,", width/2, height/2.5 + 40);
  mn.text("you get 1 death. If you get 3 deaths you lose.", width/2, height/2.5 + 80);
  mn.text("4. If you catch a duck you lose a death", width/2, height/2.5 + 120);
  mn.text("and everything slows down.", width/2, height/2.5 + 160)
  mn.textSize(40);
  mn.textAlign(LEFT, CENTER);
  mn.text("Points: " + end_score, width/2 - 300, height/2.5 + 218);
  mn.textAlign(RIGHT, CENTER);
  mn.text("Top: " + most, width/2 + 240, height/2.5 + 218);
  mn.textSize(25);
  mn.textAlign(CENTER, CENTER);
  mn.text("Made by Elliot J.", width/2, height/2.5 + 220);
  image(mn, 0, 0);
}

function keyPressed() { toggleMenu() }

function mouseClicked() { toggleMenu() }

function mousePressed() { oneWayMenu(true) }

function mouseReleased() { toggleMenu(false) }

function toggleMenu() {
  if (menuScreen) {
    menuScreen = false;
  } else {
    menuScreen = true;
  }
}

function oneWayMenu(enabled) {
    menuScreen = enabled;
}

function drawHolden() {
  strokeWeight(0);
  for (const projectile of projectiles) {
    if ((projectile.y >= height/2 - 100 && (projectile.x + 300 > holden.x && projectile.x < holden.x + 300)) || (projectile.y >= height/2 && (projectile.x + 100 > holden.x && projectile.x < holden.x + 100))) {
      catching = true;
    }
  }
  for (const projectile of safeUp) {
    if ((projectile.y >= height/2 - 100 && (projectile.x + 300 > holden.x && projectile.x < holden.x + 300)) || (projectile.y >= height/2 && (projectile.x + 100 > holden.x && projectile.x < holden.x + 100))) {
      catching = true;
    }
  }
  if (catching) {
    if (holden.img == holdenRight || holden.img == holdenCryRight) {
        holden.img = holdenCatchLeft;
      } else if (holden.img == holdenLeft || holden.img == holdenCryLeft) {
        holden.img = holdenCatchRight;
      }
  } else {
    holden.img = holdenLeft;
  }
  let nvm = false;
  for (const proj of dead) {
      if (proj.what == "rock") {
          nvm = true;
      }
  }
  if (dead.length > 0 && !nvm) {
    holden.img = holdenCryLeft;
  }
  nvm = false;
  changeVelocity();
  if (holden.x + velocity > 176 && holden.x + velocity <= 700) {
    holden.x += velocity;
  }
  image(holden.img, holden.x, holden.y, 100, 120);
  catching = false;
}

function drawDeaths() {
  fill(255, 0, 0);
  textSize(40);
  text("Deaths:", width/2 - 170, height/3 + 15);
  textAlign(RIGHT, CENTER);
  if (deaths >= 1) {
    rect(width/2 - 20, height/3, 10, 30);
  }
  if (deaths >= 2) {
    rect(width/2, height/3, 10, 30);
  }
  if (deaths >= 3) {
    rect(width/2 + 20, height/3, 10, 30);
    if (score > most) {
      most = score;
    }
    toggleMenu();
  }
}

function draw() {
  background(bg);
  if (!menuScreen) {
    textSize(32);
    fill(0);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text("Points: " + str(score), 20, 30);
    drawDeaths();
    drawHolden();
    if (!one) {
      newProjectile();
      one = true;
    }
    drawProjectiles();
  } else {
    menu();
  }
}