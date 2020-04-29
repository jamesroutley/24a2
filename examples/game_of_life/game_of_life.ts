function update(game: Game, grid: Grid) {}

function onDotClicked(x: number, y: number) {
  console.log(x, y);
}

let config = {
  update: update,
  onDotClicked: onDotClicked
};

let game = new Game(config);
game.run();
