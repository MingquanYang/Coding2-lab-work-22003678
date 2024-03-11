let slider1;
let slider2;
let slider3;
let b = [];
let w = 800;
let h = 600;
let particles = [];
let maxParticles = 300;
let noiseScale = 0.02;

function setup() {
  createCanvas(w, h);
  slider1 = createSlider(0, 255, 50);
  slider1.position(700, 520);
  slider1.style('width', '80px');
  slider2 = createSlider(0, 255, 50);
  slider2.position(700, 540);
  slider2.style('width', '80px');
  slider3 = createSlider(0, 50, 25);
  slider3.position(700, 560);
  slider3.style('width', '80px');
  button1 = createButton('Aqua Swarm');
  
  button1.position(0, 490);
  button1.mousePressed(() => {
    slider1.value(150);
    slider2.value(20);
    slider3.value(20);
  });
  button2 = createButton('Blossom Breeze');
  button2.position(0, 520);
  button2.mousePressed(() => {
    slider1.value(50);
    slider2.value(5);
    slider3.value(10);
  });
  button3 = createButton('Spore  Spread');
  button3.position(0, 550);
  button3.mousePressed(() => {
    slider1.value(150);
    slider2.value(5);
    slider3.value(45);
  });
  button4 = createButton('Photon Dance');
  button4.position(0, 580);
  button4.mousePressed(() => {
    slider1.value(0);
    slider2.value(0);
    slider3.value(0);
  });

  for (let i = 0; i < 3; i++) {
    let c = createVector(random(width), random(height));
    let v = createVector(random(-1, 1), random(-1, 1));
    let p = createVector();
    b.push({ a: createVector(), v: v, p: c });
  }
}

function draw() {
  background(255, 5);
  b.forEach((c, j) => {
    boids_flock(b, j);
    let v = c.v;
    let p = c.p;
    v.add(c.a);
    v.limit(3);
    p.add(v);
    let T = (x, q) => (x < 0) ? q : (x > q) ? 0 : x;
    noStroke();
    fill(getParticleColor()); 
    p.x = T(p.x, w);
    p.y = T(p.y, h);
    

    if (slider1.value() > 100) {
      let angle = v.heading() + PI / 2;
      let size = random(7);
      beginShape();
      vertex(p.x + cos(angle) * size, p.y + sin(angle) * size);
      vertex(p.x + cos(angle + TWO_PI / 3) * size, p.y + sin(angle + TWO_PI / 3) * size);
      vertex(p.x + cos(angle + TWO_PI * 2 / 3) * size, p.y + sin(angle + TWO_PI * 2 / 3) * size);
      endShape(CLOSE);
    } else {
      circle(p.x, p.y, random(7));
    }
  });

  // 添加第五种模式的粒子效果
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }

  if (mouseIsPressed) {
    for (let i = 0; i < 10; i++) {
      particles.push(new Particle(mouseX, mouseY));
    }
  }
}

function getParticleColor() {
  let mode = '';
  if (slider1.value() > 100) mode = 'fish';
  else if (slider1.value() < 50) mode = 'fungus';
  else mode = 'warm';

  switch (mode) {
    case 'fish':
      return color(0, 0, random(100, 255), 220); 
    case 'warm':
      return color(random(200, 255), random(100, 150), 0, 220); 
    case 'ray':
      return color(random(220), random(255), random(255), 220); 
    case 'fungus':
      return color(255, 255, 0, 220);
  }
}

let M = 3;
let r = 18;
let F = 0.28;

function mouseDragged() {
  new_Boid(mouseX, mouseY);
}

function new_Boid(x, y) {
  b.push({
    a: createVector(0, 0),
    v: createVector(random(-1, 1), random(-1, 1)),
    p: createVector(x, y)
  });
}

function boids_flock(boids, j) {
  let sep = boids_separate(boids, j);  
  let ali = boids_align(boids, j);      
  let coh = boids_cohesion(boids, j);   

  sep.mult(1.5);
  ali.mult(0.99);
  coh.mult(0.99);

  b[j].a.add(sep);
  b[j].a.add(ali);
  b[j].a.add(coh);
}

function seek(target, j) {
  let t = b[j];
  let desired = p5.Vector.sub(target, t.p);
  desired.normalize();
  desired.mult(M);
  let steer = p5.Vector.sub(desired, t.v);
  steer.limit(F);
  return steer;
}

function boids_separate(boids, j) {
  let t = boids[j];
  let desiredseparation = slider3.value();
  let steer = createVector();
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(t.p, boids[i].p);
    if ((d > 0) && (d < desiredseparation)) {
      let diff = p5.Vector.sub(t.p, boids[i].p);
      diff.normalize();
      diff.div(d);
      steer.add(diff);
      count++;
    }
  }
  if (count > 0) {
    steer.div(count);
  }

  if (steer.mag() > 0) {
    steer.normalize();
    steer.mult(M);
    steer.sub(t.v);
    steer.limit(F);
  }
  return steer;
}

function boids_align(boids, j) {
  let t = boids[j];
  let neighbordist = slider2.value();
  let sum = createVector();
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(t.p, boids[i].p);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].v);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(M);
    let steer = p5.Vector.sub(sum, t.v);
    steer.limit(F);
    return steer;
  } else {
    return createVector();
  }
}

function boids_cohesion(boids, j) {
  let t = boids[j];
  let neighbordist = slider1.value();
  let sum = createVector();
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(t.p, boids[i].p);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].p);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return seek(sum, j);
  } else {
    return createVector();
  }
}

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D().mult(random(1, 3));
    this.acceleration = createVector(0, 0.1);
    this.color = color(0, 0, 0, 150);
    this.lifespan = 255;
    this.noiseOffset = createVector(random(1000), random(1000));
    this.size = random(5, 15);
    this.rotationSpeed = random(-0.02, 0.02);
  }

  update() {
    let noiseValue = noise(this.noiseOffset.x, this.noiseOffset.y);
    let angle = map(noiseValue, 0, 1, -PI, PI);
    this.velocity.rotate(angle);

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
    this.noiseOffset.add(0.01, 0.01);
  }

  display() {
    let fillColor = lerpColor(this.color, color(255), this.lifespan / 255);
    fill(fillColor);

    push();
    translate(this.position.x, this.position.y);
    rotate(frameCount * this.rotationSpeed);
    ellipse(0, 0, this.size, this.size);
    pop();
  }

  isFinished() {
    return this.lifespan <= 0;
  }
}
