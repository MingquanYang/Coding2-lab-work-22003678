let myFont;
let bgImg;
let points1 = [], points2 = [], points3 = [];
let word1 = "ARE", word2 = "CODING", word3 = "POEMS!";
let basePointSize = 4; 
let fontSize1 = 190, fontSize2 = 200, fontSize3 = 180;
let r = 12, angle = 0;
let trails = []; 

function preload() {
  myFont = loadFont("Chivo-Bold.otf");
  font = loadFont("fonts/PlayfairDisplay-VariableFont_wght.ttf");
  bgImg = loadImage("images/background2.png");//
}

function setup() {
  createCanvas(1000, 600);
  angleMode(DEGREES);
  stroke(1, 16, 165);
  points1 = myFont.textToPoints(word1, 100, 350, fontSize1, {
    sampleFactor: 0.1,
    simplifyThreshold: 0
  });

  points2 = myFont.textToPoints(word2, 100, 160, fontSize2, {
    sampleFactor: 0.2, 
    simplifyThreshold: 0.0,
  });

  points3 = font.textToPoints(word3, 0, 0, fontSize3);
}

function draw() {
  image(bgImg, 0, 0, width, height);

  drawFirstAndSecondWords();
  drawThirdWord();
  drawRotatingHexagram2();
}

function drawFirstAndSecondWords() {
  // 第一个字母
  push();
  noStroke();
  fill(0);
  for (let i = 0; i < points1.length; i++) {
    let pt = points1[i];
    ellipse(pt.x + r * sin(angle + i * 25), pt.y, basePointSize, basePointSize);
    fill(1, 16, 165);
  }
  pop();
  
  // 第二个字母
  for (let k = 0; k < points2.length; k++) {
    let pt = points2[k];
    let d = dist(pt.x, pt.y, mouseX, mouseY);
    let pointSize = basePointSize * map(d, 0, 300, 12, 1);
    ellipse(pt.x, pt.y, pointSize, pointSize);
  }
  
  angle += 10;
}

function drawThirdWord() {
  let bounds = font.textBounds(word3, 0, 0, fontSize3);
  let cx = (width - bounds.w) / 2;
  let cy = (height + bounds.h) / 2;
  
  let yOffset = 160;
  let xOffset = 20;
  for (let i = 0; i < points3.length; i++) {
    let p = points3[i];
    let x = p.x + cx + xOffset;
    let y = p.y + cy + yOffset; 
    
    let shiftValue = map(mouseX, 0, width, 0, 40);
    let radius = map(mouseY, 0, height, 0, 10);
    
    x += (i % 2 == 0) ? -shiftValue : shiftValue;
    ellipse(x, y, radius);
    fill(34, 51, 175);
  }
}



function drawRotatingHexagram2() {
  push(); 
  translate(width / 2+200, height / 2 + 40); 
  rotate(map(mouseX, 0, width, -45, 45)); 
  
  stroke(1, 16, 165); 
  fill(1, 16, 165); 
  strokeWeight(2); 
  beginShape();
  for (let i = 0; i < 6; i++) {
    let x = cos(60 * i) * 40; 
    let y = sin(60 * i) * 40;
    vertex(x, y);
    x = cos(60 * i + 30) * 20;
    y = sin(60 * i + 30) * 20;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  pop();
}