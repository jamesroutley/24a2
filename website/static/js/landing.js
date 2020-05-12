const gridHeight = 7;
const gridWidth = 24;
const colors = Object.values(Color).slice(2);

function update(game) {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const color = colors[y];

      shouldFill = (96 + game.getFrameCount() - x - y) % 96 < 5;
      if (shouldFill) {
        game.setDot(x, y, color);
      }
    }
  }
}

let config = {
  update: update,
  _gridWidth: gridWidth,
  _gridHeight: gridHeight,
  containerId: "landing-sketch"
};

let game = new Game(config);
document.addEventListener("DOMContentLoaded", game.run.bind(game), false);
