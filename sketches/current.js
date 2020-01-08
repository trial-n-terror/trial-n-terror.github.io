let points = [{
    x: 20,
    y: 20
  },
  {
    x: 100,
    y: 20
  },
  {
    x: 100,
    y: 100
  },
  {
    x: 20,
    y: 100
  }
];
let switches = [];
let dotSlider;
let speedSlider;
let radio;
let button;


function setup() {
  var canvas = createCanvas(400, 400);
 
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  
  dotSlider = createSlider(0, 100, 10);
  dotSlider.position(250, 20);
  dotSlider.parent('sketch-holder');
  speedSlider = createSlider(0, 10, 1);
  speedSlider.position(250, 50);
  speedSlider.parent('sketch-holder');

  radio = createRadio();
  radio.option('create point', 1);
  radio.option('delete point', 2);
  radio.option('create switch', 3);
  radio.option('delete switch', 4);
  radio.option('flip switch', 5);
  radio.style('width', '130px');
  textAlign(CENTER);
  radio.position(250, 80);
  radio.parent('sketch-holder');
}

let t = 0;

function draw() {
  background("white");
  if (!button || button.open)
    t += speedSlider.value() / 100;

  noFill();

  for (let i = 0; i < points.length; ++i) {
    let i0 = (i + 0) % points.length;
    let i1 = (i + 1) % points.length;
    let i2 = (i + 2) % points.length;
    let i3 = (i + 3) % points.length;

    stroke(255, 102, 0);
    curve(points[i0].x, points[i0].y, points[i1].x, points[i1].y, points[i2].x, points[i2].y, points[i3].x, points[i3].y);

    stroke(200);
    line(points[i0].x - 5, points[i0].y, points[i0].x + 5, points[i0].y);
    line(points[i0].x, points[i0].y - 5, points[i0].x, points[i0].y + 5);
  }

  let numDots = dotSlider.value();
  for (let i = 0; i < numDots; ++i) {
    drawPointOnCurve(t + points.length * i / numDots);
  }
  
  if (button)
    drawSwitch(button.x, button.y, button.open);
}

function mouseClicked() {
  if (mouseX > width || mouseX < 0 || mouseY > height || mouseY < 0) {
    return;
  }
  if (mouseX > 250) {
    return;
  }
  let val = parseInt(radio.value());
  switch (val) {
    case 1:
      addPoint();
      break;
    case 2:
      deletePoint();
      break;
    case 3:
      addSwitch();
      break;
    case 4:
      deleteSwitch();
      break;
    case 5:
      flipSwitch();
      break;
    default:
      break;
  }

  // prevent default
  return false;
}

function addPoint() {
  points.push({
    x: mouseX,
    y: mouseY
  });
}

function deletePoint() {
  for (let i = 0; i < points.length; ++i) {
    let p = points[i];
    if (dist(p.x, p.y, mouseX, mouseY) < 10) {
      points.splice(i, 1);
      return;
    }
  }
}

function addSwitch() {
  createSwitch(mouseX, mouseY);
}

function deleteSwitch() {
  for (let i = 0; i < switches.length; ++i) {
    let p = switches[i];
    if (dist(p.x, p.y, mouseX, mouseY) < 10) {
      switches.splice(i, 1);
      return;
    }
  }
}

function flipSwitch() {
    let p = button;
    if (dist(p.x, p.y, mouseX, mouseY) < 10) {
      button.open = !button.open;
      return;
    }
}

function drawSwitch(x, y, open) {
  noFill();
  if (!open) {
    fill("black");
  }
  rect(x - 10, y - 10, 20, 20);
}

function drawPointOnCurve(t0) {
  if (points.length <= 0) {
    return;
  }

  stroke(0);
  let c = floor(t0);
  c = c % points.length;
  t0 = c + t0 - floor(t0);

  let i0 = (c + 0) % points.length;
  let i1 = (c + 1) % points.length;
  let i2 = (c + 2) % points.length;
  let i3 = (c + 3) % points.length;

  let x = curvePoint(points[i0].x, points[i1].x, points[i2].x, points[i3].x, t0 - c);
  let y = curvePoint(points[i0].y, points[i1].y, points[i2].y, points[i3].y, t0 - c);

  circle(x, y, 5);
}

function createSwitch(x, y) {
  let distances = [];
  for (let i = 0; i < points.length; ++i) {
    let p = points[i];
    let d = dist(x, y, p.x, p.y);
    
    distances.push({
      i: i,
      d: d
    });
  }

  distances.sort(function(a, b) {
    return a.d - b.d;
  });
  let twoClosestPoints = [distances[0], distances[1]];
  twoClosestPoints.sort(function(a, b) {
    return a.i - b.i;
  });
  if (twoClosestPoints[0].i === 0 &&
    twoClosestPoints[1].i === points.length - 1) {
    twoClosestPoints.reverse();
  }

  let c = twoClosestPoints[0].i;
  let i0 = (c + 3) % points.length;
  let i1 = (c + 0) % points.length;
  let i2 = (c + 1) % points.length;
  let i3 = (c + 2) % points.length;

  x = curvePoint(points[i0].x, points[i1].x, points[i2].x, points[i3].x, .5);
  y = curvePoint(points[i0].y, points[i1].y, points[i2].y, points[i3].y, .5);
  

  button = {
    x: x,
    y: y,
    open: false
  };
  
}