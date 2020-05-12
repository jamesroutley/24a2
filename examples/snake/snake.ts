let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress
};

let game = new Game(config);
game.run();

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

// TODO: ransomise initial snakeDirection
let snakeDirection = Direction.Right;

// TODO: randomise snake start position
let snake: Array<Point> = [
  { x: 7, y: 7 },
  { x: 6, y: 7 }
];

let pill: Point;

// This fixes a bug where you can turn back on yourself if you quickly type
// two arrow keys before the next time `update` is called
let snakeDirectionChangeThisFrame: boolean = false;

function createPill() {
  // Don't create a pill on the snake
  function pointInSnake(p: Point): boolean {
    // Consider the point one ahead of the snake to be in the snake too
    if (pointsEqual(p, getNextLocation(snake[0], snakeDirection))) {
      return true;
    }
    for (let dot of snake) {
      if (pointsEqual(dot, p)) {
        return true;
      }
    }
    return false;
  }

  let proposedPill = {
    x: Math.floor(Math.random() * 24),
    y: Math.floor(Math.random() * 24)
  };
  while (pointInSnake(proposedPill)) {
    proposedPill = {
      x: Math.floor(Math.random() * 24),
      y: Math.floor(Math.random() * 24)
    };
  }

  pill = proposedPill;
}

function create(game: Game) {
  // Drop framerate
  game.setFrameRate(5);

  createPill();
}

function update(game: Game) {
  snakeDirectionChangeThisFrame = false;
  let head = snake[0];
  let nextLocation = getNextLocation(head, snakeDirection);

  // If nextLocation is in the snake, end the game
  if (game.getDot(nextLocation.x, nextLocation.y) === Color.Black) {
    // Color the snake in red
    snake.forEach(dot => {
      game.setDot(dot.x, dot.y, Color.Red);
    });
    game.end();
    return;
  }

  // If nextLocation is a pill, increase snake size
  if (nextLocation.x === pill.x && nextLocation.y === pill.y) {
    sectionsToAdd += getSectionsForScore(score);
    createPill();
    score++;
  }

  game.setText(`Score: ${score}`);

  // Push the next location to the front of the snake
  snake.unshift(nextLocation);
  // Clear the back of the snake, if we don't have sections we need to add
  if (sectionsToAdd === 0) {
    let exLocation = snake.pop();
    if (exLocation) {
      game.setDot(exLocation.x, exLocation.y, Color.Gray);
    }
  } else {
    sectionsToAdd--;
  }

  // Draw snake and pill
  snake.forEach(dot => {
    game.setDot(dot.x, dot.y, Color.Black);
  });
  game.setDot(pill.x, pill.y, Color.Red);
}

function getSectionsForScore(score: number): number {
  // N.B: this is quite a steep increase in difficulty
  return score + 1;
}

function getNextLocation(location: Point, snakeDirection: Direction): Point {
  let nextLocation = { x: location.x, y: location.y };
  if (snakeDirection === Direction.Right) {
    nextLocation.x++;
  }
  if (snakeDirection === Direction.Left) {
    nextLocation.x--;
  }
  if (snakeDirection === Direction.Up) {
    nextLocation.y--;
  }
  if (snakeDirection === Direction.Down) {
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

function onKeyPress(direction: Direction) {
  if (snakeDirectionChangeThisFrame) {
    return;
  }
  switch (direction) {
    case Direction.Left:
      if (snakeDirection === Direction.Right) {
        return;
      }
      snakeDirection = Direction.Left;
      break;
    case Direction.Right:
      if (snakeDirection === Direction.Left) {
        return;
      }
      snakeDirection = Direction.Right;
      break;
    case Direction.Up:
      if (snakeDirection === Direction.Down) {
        return;
      }
      snakeDirection = Direction.Up;
      break;
    case Direction.Down:
      if (snakeDirection === Direction.Up) {
        return;
      }
      snakeDirection = Direction.Down;
      break;
  }
  snakeDirectionChangeThisFrame = true;
}
