//Размер максимальной снежинки при scale = 1
var size = 30; 
//Беспорядочность бокового движения
var perlinNoise = 0.005; 
//Сила бокового движения
var windMultiplier = 5; 
//Сила связи между соседними снежинаками для бокового движения (меньше = сильнее)
var bondStr = 3; 

let population;
let countP;
let scale;
let time = 0;

function setup() {
  let param = windowWidth > windowHeight ? windowHeight : windowWidth;
  scale = param / 500;
  size *= scale;
  createCanvas(param, param);
  population = new Population();
  countP = createP().style('background-color', color(255,255,255));
}

function draw() {
  time += perlinNoise;
  background(0);
  population.update();
  countP.html(population.pop.length);
}

function Snowflake() {
  this.pos = createVector(random(width), -size);
  this.d = scale * size / random(scale, size);
  this.velX = (windMultiplier * this.d) / size;
  this.velY = sqrt(this.d) / 2; //формула скорости, взял из головы
  this.t = map(this.d, 1, size, bondStr, 0); //random(100);

  this.update = function () {
    let wind = this.velX * map(noise(this.t + time), 0, 1, -1, 1);
    this.pos.add(wind, this.velY);
    
    if (this.pos.x > this.d + width) {
      this.pos.x = -this.d;
    }
    
    if (this.pos.x < -this.d) {
      this.pos.x = this.d + width;
    }
  };

  this.show = function () {
    push();
    noStroke();
    fill(255, map(this.d, 0, 50, 255, 200));
    translate(this.pos.x, this.pos.y);
    circle(0, 0, this.d);
    pop();
  };

  this.isOut = function () {
    return this.pos.y > this.d + height;
  };
}

function Population() {
  this.pop = [];
  
this.update = function () {
    this.pop.push(new Snowflake());

    for (let i = this.pop.length - 1; i > 0; i--) {
      if (this.pop[i].isOut()) {
        this.pop.splice(i, 1);
      } else {
        this.pop[i].update();
        this.pop[i].show();
      }
    }
  };
}