interface Point {
  x: number;
  y: number;
}

let movedThisFrame = false;

let player: Point = { x: 12, y: 12 };

let danger: Point = { x: 10, y: 10 };

function create(game: Game) {
  console.log("create called");
}

function update(game: Game) {
  game.setDot(danger.x, danger.y, Color.Yellow);

  if (movedThisFrame) {
    const previousColour = game.getDot(player.x, player.y);
    console.log(
      `Player at (${player.x}, ${player.y}, previous colour: ${previousColour})`
    );
    movedThisFrame = false;
  }

  if (player.x == danger.x && player.y == danger.y) {
    game.setDot(player.x, player.y, Color.Red);
    game.setText("Game over");
    game.end();
    return;
  }

  game.setText(`Frame: ${game.getFrameCount()}`);
  game.setDot(player.x, player.y, Color.Black);
}

function onKeyPress(direction: Direction) {
  movedThisFrame = true;
  switch (direction) {
    case Direction.Left:
      player.x--;
      return;

    case Direction.Right:
      player.x++;
      return;

    case Direction.Up:
      player.y--;
      return;

    case Direction.Down:
      player.y++;
      return;
  }
}

function onDotClicked(x: number, y: number) {
  console.log(`Dot (${x}, ${y}) clicked`);
}

let config: GameConfig = {
  create: create,
  update: update,
  onKeyPress: onKeyPress,
  onDotClicked: onDotClicked,
  clearGrid: false,
  gridHeight: 15,
  gridWidth: 20,
  frameRate: 10,
};

let game = new Game(config);
game.run();
