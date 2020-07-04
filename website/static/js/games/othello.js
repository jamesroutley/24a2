"use strict";

// TODO: If one player can not make a valid move, play passes back to the other player

let dots = [];

const directionVectors = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 1 },
  { x: 1, y: 0 },
  { x: 1, y: -1 },
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
];

let moves = [];

let currentTurn = Color.Blue;

function create(game) {
  dots = new Array(8);
  for (let y = 0; y < dots.length; y++) {
    let row = new Array(8);
    for (let i = 0; i < row.length; i++) {
      row[i] = Color.Gray;
    }
    dots[y] = row;
  }
  dots[3][3] = Color.Red;
  dots[4][4] = Color.Red;

  dots[3][4] = Color.Blue;
  dots[4][3] = Color.Blue;

  // HACK: starting position that makes it easy to test game end
  // for (let y = 0; y < dots.length; y++) {
  //   let row = dots[y];
  //   for (let x = 0; x < row.length; x++) {
  //     if (x === 0 && y === 0) {
  //       continue;
  //     }
  //     if (x === 0 && y === 7) {
  //       dots[y][x] = Color.Red;
  //       continue;
  //     }
  //     dots[y][x] = Color.Blue;
  //   }
  // }
}

function update(game) {
  for (let y = 0; y < dots.length; y++) {
    let row = dots[y];
    for (let x = 0; x < row.length; x++) {
      let color = row[x];
      game.setDot(x, y, color);
    }
  }

  game.setText(`${currentTurn}'s turn`);

  let move = moves.pop();
  // If no move has been played, move === undefined. In this case, return
  // because there's nothing else we want to do this frame
  if (!move) {
    return;
  }

  playMove(game, move);

  // We change the colour of dots during `playMove` - re-render them
  for (let y = 0; y < dots.length; y++) {
    let row = dots[y];
    for (let x = 0; x < row.length; x++) {
      let color = row[x];
      game.setDot(x, y, color);
    }
  }

  if (gameFinished()) {
    displayWinner(game);
    game.end();
    return;
  }
}

function gameFinished() {
  for (let y = 0; y < dots.length; y++) {
    let row = dots[y];
    for (let x = 0; x < row.length; x++) {
      if (validMove(game, { x: x, y: y })) {
        return false;
      }
    }
  }
  // No valid moves
  return true;
}

function displayWinner(game) {
  let numRed = 0;
  let numBlue = 0;
  for (let y = 0; y < dots.length; y++) {
    let row = dots[y];
    for (let x = 0; x < row.length; x++) {
      const color = dots[y][x];
      switch (color) {
        case Color.Red:
          numRed++;
          break;
        case Color.Blue:
          numBlue++;
          break;
      }
    }
  }

  if (numRed === numBlue) {
    game.setText("It's a tie!");
  } else if (numRed > numBlue) {
    game.setText(`Red wins ${numRed}:${numBlue}!`);
  } else {
    game.setText(`Blue wins ${numBlue}:${numRed}!`);
  }
}

function playMove(game, point) {
  if (!validMove(game, point)) {
    return;
  }

  const validDirections = getValidDirections(game, point);

  if (validDirections.length === 0) {
    return;
  }

  // Colour in the clicked dot
  dots[point.y][point.x] = currentTurn;
  for (let direction of validDirections) {
    // Colour in dots
    let currentPoint = { x: point.x + direction.x, y: point.y + direction.y };
    while (dots[currentPoint.y][currentPoint.x] !== currentTurn) {
      dots[currentPoint.y][currentPoint.x] = currentTurn;
      currentPoint = {
        x: currentPoint.x + direction.x,
        y: currentPoint.y + direction.y,
      };
    }
  }
  currentTurn = oppositeTurn();
}

function oppositeTurn() {
  if (currentTurn == Color.Red) {
    return Color.Blue;
  } else {
    return Color.Red;
  }
}

function validMoveInDirection(game, point, direction) {
  let opposite = oppositeTurn();

  function isLegalFirstMoveInDirection(p, direction) {
    const currentPoint = {
      x: p.x + direction.x,
      y: p.y + direction.y,
    };

    // We've hit a wall
    if (currentPoint.x === -1 || currentPoint.x === 8) {
      return false;
    }
    if (currentPoint.y === -1 || currentPoint.y === 8) {
      return false;
    }

    const currentColor = game.getDot(currentPoint.x, currentPoint.y);

    if (currentColor !== opposite) {
      return false;
    }
    return isLegalRemainingMoveInDirection(currentPoint, direction);
  }

  function isLegalRemainingMoveInDirection(p, direction) {
    const currentPoint = {
      x: p.x + direction.x,
      y: p.y + direction.y,
    };

    // We've hit a wall
    if (currentPoint.x === -1 || currentPoint.x === 8) {
      return false;
    }
    if (currentPoint.y === -1 || currentPoint.y === 8) {
      return false;
    }

    const currentColor = game.getDot(currentPoint.x, currentPoint.y);

    if (currentColor === Color.Gray) {
      return false;
    }

    if (currentColor === currentTurn) {
      return true;
    }

    // Else, the current dot is of the opposite colour, and we should continue
    // searching
    return isLegalRemainingMoveInDirection(currentPoint, direction);
  }

  return isLegalFirstMoveInDirection(point, direction);
}

function getValidDirections(game, point) {
  let validDirections = [];
  for (let direction of directionVectors) {
    // Travel in each direction, and check that there's at least one dot of the
    // opposite colour, followed by a dot of this colour
    if (validMoveInDirection(game, point, direction)) {
      validDirections.push(direction);
    }
  }
  return validDirections;
}

function validMove(game, point) {
  if (dots[point.y][point.x] !== Color.Gray) {
    return false;
  }
  return getValidDirections(game, point).length > 0;
}

function isLegalMove(game, point) {
  for (let direction of directionVectors) {
    // Travel in each direction, and check that there's at least one dot of the
    // opposite colour, followed by a dot of this colour
    if (validMoveInDirection(game, point, direction)) {
      return true;
    }
  }
  return false;
}

function onDotClicked(x, y) {
  moves.push({ x: x, y: y });
}

var config = {
  create: create,
  update: update,
  onDotClicked: onDotClicked,
  _gridWidth: 8,
  _gridHeight: 8,
};
var game = new Game(config);
game.run();
