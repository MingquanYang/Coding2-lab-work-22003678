
let serial;
let latestData = "waiting for data";
let knobValue = 0; 
let knobValuePurple = 0; 
let minWeight = 1; 
let maxWeight = 80; 
let minAmplitude = 1; 
let maxAmplitude = 1000; 


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);

  serial = new p5.SerialPort(); 
  serial.open("COM3");  

  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotDataFromSerial);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);
}


function serverConnected() {
  print("Connected to Server");
}


function gotList(thelist) {
  print("List of Serial Ports:");
  for (let i = 0; i < thelist.length; i++) {
    print(i + " " + thelist[i]);
  }
}


function gotOpen() {
  print("Serial Port is Open");
}

function gotClose(){
    print("Serial Port is Closed");
    latestData = "Serial Port is Closed";
}


function gotError(theerror) {
  print(theerror);
}


function gotDataFromSerial() {
  let currentString = serial.readLine();  
  trim(currentString);                    
  if (!currentString) return;             
  console.log(currentString);
  let values = currentString.split(" "); 
  knobValue = int(values[0]); //
  knobValuePurple = int(values[1]); 
}



function draw() {
  background(30);
  rotateX(66);
  noFill();
  stroke(255);

  for (let i = 0; i < 20; i++) {
    let weight = map(knobValue, 0, 1023, minWeight, maxWeight); // 映射线条粗细
    let amplitude = map(knobValue, 0, 1023, minAmplitude, maxAmplitude); // 值映射到变化幅度

    strokeWeight(weight); 
    beginShape();

    for (let j = 0; j < 360; j += 10) {
      let rad = i * 17;
      let x = rad * cos(j);
      let y = rad * sin(j);
      let z = sin(frameCount * 2 + i * 12) * amplitude;

      vertex(x, y, z);
    }

    endShape(CLOSE);
  }
}

function updateKnobValue(newKnobValue) {
  knobValue = newKnobValue;
}
