let playerX = 11;
const playerY = 20; // const because the player doesn't move in Y axis

let treeRows: Array<TreeRow> = new Array(24);

interface TreeRow {
  x: number;
  gap: number;
}

function create(game: Game) {
  // Initialise trees
  for (let y = 23; y >= 0; y--) {
    treeRows[y] = {
      x: 7,
      gap: 10
    };
  }
}

function update(game: Game) {
  game.setText(`Distance: ${game.getFrameCount()}`);

  treeRows.unshift(getNextTreeRow(treeRows[0]));
  treeRows.pop();

  drawTrees(game);

  if (game.getDot(playerX, playerY) === Color.Green) {
    // Player has hit a tree, end game
    game.setDot(playerX, playerY, Color.Red);
    game.end();
    return;
  }

  // Draw player
  game.setDot(playerX, playerY, Color.Black);
}

function drawTrees(game: Game) {
  treeRows.forEach((row, y) => {
    // Draw the left hand side of this row
    for (let x = 0; x < row.x; x++) {
      game.setDot(x, y, Color.Green);
    }

    // Draw the right hand side of this row
    for (let x = row.x + row.gap; x < 24; x++) {
      game.setDot(x, y, Color.Green);
    }
  });
}

// This function defines the difficulty of the game. It would be nice if it got
// progressively harder based on the current frameCount
function getNextTreeRow(currentRow: TreeRow): TreeRow {
  if (Math.random() < 0.5) {
    // 50% chance of randomisng the gap size
    const gapRandom = Math.floor(Math.random() * 3);
    const oldGap = currentRow.gap;
    let newGap: number;
    switch (gapRandom) {
      case 0:
        newGap = oldGap - 1;
        break;
      case 1:
        newGap = oldGap;
        break;
      default:
        newGap = oldGap + 1;
        break;
    }

    if (newGap < 3 || newGap > 9) {
      return currentRow;
    }
    return {
      x: currentRow.x,
      gap: newGap
    };
  }

  // Else, randomize x
  const xRandom: number = Math.floor(Math.random() * 3);
  const oldX = currentRow.x;
  let newX: number;
  switch (xRandom) {
    case 0:
      newX = oldX - 1;
      break;
    case 1:
      newX = oldX;
      break;
    default:
      newX = oldX + 1;
      break;
  }

  // There must be at least one tree on each side of the track
  if (newX < 1 || newX + currentRow.gap >= 22) {
    return currentRow;
  }

  return {
    x: newX,
    gap: currentRow.gap
  };
}

function onKeyPress(direction: Direction) {
  switch (direction) {
    case Direction.Left:
      if (playerX === 0) {
        return;
      }
      playerX--;
      break;
    case Direction.Right:
      if (playerX === 23) {
        return;
      }
      playerX++;
      break;
  }
}

let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress
};

let game = new Game(config);
game.run();
