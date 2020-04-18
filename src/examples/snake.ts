interface Point {
  x: number;
  y: number;
}

// TODO: ransomise initial direction
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

// TODO: I think there's a bug where the pill can be created in the spot the
// snake is about to move to
function createPill(grid: Grid) {
  let pill = {
    x: Math.floor(random(24)),
    y: Math.floor(random(24))
  };

  // Don't create a pill on the snake
  function pointInSnake(p: Point): boolean {
    snake.forEach(dot => {
      if (dot.x === p.x && dot.y === p.y) {
        return true;
      }
    });
    return false;
  }
  while (pointInSnake(pill)) {
    pill = {
      x: Math.floor(random(24)),
      y: Math.floor(random(24))
    };
  }

  grid.setDot(pill.x, pill.y, Color.Red);
}

function init(grid: Grid) {
  // Drop framerate
  frameRate(5);

  setSnake(grid);
  createPill(grid);
}

function update(grid: Grid) {
  directionChangeThisFrame = false;
  let head = snake[0];
  let nextLocation = { x: head.x, y: head.y };

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
    let end = snake.pop();
    if (!end) {
      console.error("zero length snake");
      return;
    }
    snake.push(end);
    snake.push(end);
    createPill(grid);
  }

  snake.unshift(nextLocation);
  let exLocation = snake.pop();
  if (exLocation) {
    grid.setDot(exLocation.x, exLocation.y, 0);
  }

  setSnake(grid);
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
