---
title: 24a4
---

24a2 is a simple game engine that lets you to build a game in a few hours. It
has a very limited set of features which makes it easy to learn, and encourages
you to solve problems creatively.

24a2 games are written in JavaScript (or TypeScript) and are played in a web
browser, so you can easily share what you've created.

## Introduction

All 24a2 games feature a 24 by 24 grid of dots. You can set the color of each
dot, and read the color of each dot back. 24a2 can also run a function you
define when an arrow key is pressed, or when a dot is clicked on.

That's about it! There are a few other features, which you can find out about in
the [tutorial](/tutorial) and the [API reference](/reference").

Using 24a2 means you don't have to think about the visual style of your game,
complicated physics or sound - you can just focus on actually building
something.

## Example games

Here are a few demo games you can play to get a feel for what 24a2 is like:

- [Snake](/games/snake)
- [Skiing](/games/skiing)

## Example code

```javascript
// We use this config object to specify the functions that
// 24a2 should call on each frame of the game
let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress
};

// Initialise a new game
let game = new Game(config);

// Create is called once, at startup. Use this function to
// initialise variables etc
function create(game: Game) {
  game.setFrameRate(5);
}

// Update is called on each iteration of the game
function update(game: Game) {
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
