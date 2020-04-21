# 24a2

24a2 is an ultra minimalist game engine. It's objective is to let you build a game in a couple of hours. It does this by severely limiting what you can do.

Things 24a2 supports:

- A 24x24 grid of dots
- The ability to set the colour of each dot to one of eight colours
- The ability to read a dot's colour
- Keyboard input (arrow keys only)
- Variable framerate

Things 24a2 doesn't support:

- Everything else

## Example

```js
// We use this config object to specify the functions that 24a2 should call on
// each frame of the game
let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress
};

// Initialise a new game
let game = new Game(config);

// Create is called once, at startup. Use this function to initialise
// variables etc
function create(game: Game, grid: Grid) {
  game.setFrameRate(5);
}

// Update is called on each iteration of the game
function update(game: Game, grid: Grid) {
  const frameCount = game.getFrameCount();
  game.setText(`Frame count: ${frameCount}`);

  if (frameCount === 100) {
    // We can stop the game with game.end()
    game.end();
  }
}

// onKeyPress is called when one of the arrow keys is called
function onKeyPress(direction: Direction) {
  // TODO
}

// Start the game
game.run();
```

## TODO

- [ ]: Automatic API documentation, possibly using [TypeDoc](https://typedoc.org/)
- [ ]:

## Possible features

- Builtin (x, y) Point object
