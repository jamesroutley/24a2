interface Point {
  x: number;
  y: number;
}

function pointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

let score = 0;

// sectionsToAdd stores the number of dots to add to the snake. We add sections
// when the snake 'eats' a pill, to increase difficulty. As the game progesses,
// we add more and more sections per pill
let sectionsToAdd = 0;

// TODO: ransomise initial direction
// TODO: make this an enum
let direction = "RIGHT";

// TODO: randomise snake start position
let snake: Array<Point> = [
  { x: 7, y: 7 },
  { x: 6, y: 7 }
];

// This fixes a bug where you can turn back on yourself if you quickly type
// two arrow keys before the next time `update` is called
let directionChangeThisFrame: boolean = false;

function setSnake(grid: Grid) {
  snake.forEach(dot => {
    grid.setDot(dot.x, dot.y, 1);
  });
}

function createPill(grid: Grid) {
  let pill = {
    x: Math.floor(Math.random() * 24),
    y: Math.floor(Math.random() * 24)
  };

  // Don't create a pill on the snake
  function pointInSnake(p: Point): boolean {
    // Consider the point one ahead of the snake to be in the snake too
    if (pointsEqual(p, getNextLocation(snake[0], direction))) {
      return true;
    }
    for (let dot of snake) {
      if (pointsEqual(dot, p)) {
        return true;
      }
    }
    return false;
  }
  while (pointInSnake(pill)) {
    pill = {
      x: Math.floor(Math.random() * 24),
      y: Math.floor(Math.random() * 24)
    };
  }

  console.log(`creating pill at (${pill.x}, ${pill.y})`);
  grid.setDot(pill.x, pill.y, Color.Red);
}

function init(grid: Grid) {
  // Drop framerate
  setFrameRate(5);

  setSnake(grid);
  createPill(grid);
}

function update(grid: Grid) {
  directionChangeThisFrame = false;
  let head = snake[0];
  let nextLocation = getNextLocation(head, direction);

  // If nextLocation is in the snake, end the game
  if (grid.getDot(nextLocation.x, nextLocation.y) === Color.Black) {
    // Color the snake in red
    snake.forEach(dot => {
      grid.setDot(dot.x, dot.y, Color.Red);
    });
    endGame();
    return;
  }

  // If nextLocation is a pill, increase snake size
  if (grid.getDot(nextLocation.x, nextLocation.y) === Color.Red) {
    sectionsToAdd += getSectionsForScore(score);
    createPill(grid);
    score++;
  }

  setBottomText(`Score: ${score}`);

  // Push the next location to the front of the snake
  snake.unshift(nextLocation);
  // Clear the back of the snake, if we don't have sections we need to add
  if (sectionsToAdd === 0) {
    let exLocation = snake.pop();
    if (exLocation) {
      grid.setDot(exLocation.x, exLocation.y, 0);
    }
  } else {
    sectionsToAdd--;
  }

  setSnake(grid);
}

function getSectionsForScore(score: number): number {
  // N.B: this is quite a steep increase in difficulty
  return score + 1;
}

function getNextLocation(location: Point, direction: string): Point {
  let nextLocation = { x: location.x, y: location.y };
  if (direction === "RIGHT") {
    nextLocation.x++;
  }
  if (direction === "LEFT") {
    nextLocation.x--;
  }
  if (direction === "UP") {
    nextLocation.y--;
  }
  if (direction === "DOWN") {
    nextLocation.y++;
  }

  // Modulo x and y to wrap around
  if (nextLocation.x > 23) {
    nextLocation.x = 0;
  }
  if (nextLocation.y > 23) {
    nextLocation.y = 0;
  }
  if (nextLocation.x < 0) {
    nextLocation.x = 23;
  }
  if (nextLocation.y < 0) {
    nextLocation.y = 23;
  }

  return nextLocation;
}

function onLeftKeyPress() {
  if (directionChangeThisFrame) {
    return;
  }
  if (direction === "RIGHT") {
    return;
  }
  direction = "LEFT";
  directionChangeThisFrame = true;
}

function onRightKeyPress() {
  if (directionChangeThisFrame) {
    return;
  }
  if (direction === "LEFT") {
    return;
  }
  direction = "RIGHT";
  directionChangeThisFrame = true;
}

function onUpKeyPress() {
  if (directionChangeThisFrame) {
    return;
  }
  if (direction === "DOWN") {
    return;
  }
  direction = "UP";
  directionChangeThisFrame = true;
}

function onDownKeyPress() {
  if (directionChangeThisFrame) {
    return;
  }
  if (direction === "UP") {
    return;
  }
  direction = "DOWN";
  directionChangeThisFrame = true;
}
