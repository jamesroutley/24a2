---
title: Tutorial
---

Let's build a simple game using 24a2. In our game, the player will have a
limited time to move around and collect items. Each item will give the player a
point.

[Play the game](/games/tutorial)

[See the source code](https://github.com/jamesroutley/24a2/tree/master/examples/tutorial)

## 1. Basic setup

24a2 games are written in JavaScript, and are played in the browser. In this
step, we'll create two files, an `index.html` which stores the content of our
webpage, and `game.js`, which contains our game code.

In your text editor, create a new file named `index.html`, and copy and paste
the following code into it:

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/gh/jamesroutley/24a2/build/engine.js"></script>
    <script src="game.js"></script>
  </head>
  <body></body>
</html>
```

Here, we've created a HTML file that runs two JavaScript scripts:

1. Imports the 24a2 game engine code
2. Runs the script where we'll define our game

Next, create a new file called `game.js`, and copy and paste the following code
into it:

```javascript
function create(game) {}

function update(game) {}

function onKeyPress(direction) {}

let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress,
};

let game = new Game(config);
game.run();
```

Make sure that `game.js` is saved in the same folder as your `index.html` file.

Open `index.html` in your browser, and you should see a 24 by 24 grid of gray
dots.

## 2. 24a2 overview

Let's take a look at the code that currently makes up our `game.js` file:

- The `create` function is called once by 24a2, before the game starts running.
  We can use this function to initialise anything we need before the game
  properly starts.
- While the game is running, the `update` function is repeatedly called. This is
  where we'll implement most of our game mechanics.
- Every time the player presses one of the arrow keys, 24a2 calls the
  `onKeyPress` function.
- Finally, we create the config object, which lets us tell 24a2 which functions
  it should call, we create a new game and run it.

## 3. Setting up our game

To set up our game, we need to create a player:

```javascript
let player = {};

function create(game) {
  player = {
    x: 5,
    y: 10,
  };
  game.setDot(player.x, player.y, Color.Black);
}

function update(game) {
  game.setDot(player.x, player.y, Color.Black);
}
```

We declare a new global variable `player`, which stores the player's `x` and `y`
coordinates. `player` needs to be global, because we access it in both `create`
and `update`. In the `create` function, we set the player's initial coordinates,
and in `update`, we draw the player, by setting the dot at the player's location
to the color black.

The grid's coordinates are counted from the top left corner, and go from 0
to 23. So the coordinate `{x: 0, y: 0}` is the top left corner, `{x: 23, y: 0}`
is the top right corner and `{x: 23, y: 23}` is the bottom right corner.

## 4. Movement

Let's wire up the `onKeyPress` function to let us move the player using the
arrow keys:

```javascript
function onKeyPress(direction) {
  if (direction == Direction.Up) {
    player.y--;
  }
  if (direction == Direction.Down) {
    player.y++;
  }
  if (direction == Direction.Left) {
    player.x--;
  }
  if (direction == Direction.Right) {
    player.x++;
  }
}
```

If you refresh the webpage, you should be able to control the player with the
arrow keys. You might notice a bug though - if we keep going in one direction
long enough, our player goes off the edge of the grid! Let's update `onKeyPress`
to stop this from happening:

```javascript
function onKeyPress(direction) {
  if (direction == Direction.Up && player.y > 0) {
    player.y--;
  }
  if (direction == Direction.Down && player.y < 23) {
    player.y++;
  }
  if (direction == Direction.Left && player.x > 0) {
    player.x--;
  }
  if (direction == Direction.Right && player.x < 23) {
    player.x++;
  }
}
```

## 5. Generating items

Let's add some code to randomly generate an item.

```javascript
let items = [];

function update(game) {
  // Only generate an item 5% of the time
  if (Math.random() < 0.05) {
    item = {
      x: Math.floor(Math.random() * 24),
      y: Math.floor(Math.random() * 24),
    };
    if (item.x !== player.x || item.y !== player.y) {
      items.push(item);
    }
  }

  for (item of items) {
    game.setDot(item.x, item.y, Color.Green);
  }

  game.setDot(player.x, player.y, Color.Black);
}
```

We create a new global variable to store the coordinates of each item, `items`.

In the `update` function, we generate a new item at a random location[^1], but
only on 5% of the calls to `update`. We also only create the item if it isn't
where the player currently is.

## 6. Collecting items

Currently, nothing happens when our player walks over an item. Let's change it
so the item disappears, and the user's score increases. We can display the
user's current score using the `game.setText` function.

```javascript
let score = 0;

function update(game) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.x == player.x && item.y == player.y) {
      score++;
      items.splice(i, 1);
      break;
    }
  }

  // ...

  game.setText(Score: ${score}`)
}
```

We iterate through all the items, and if the item is at the same position as the
player, we increment the score and remove the item from the list.

## 7. Time limit

So far, we've got a game that lets us move around, and collect items which give
us points. Let's create some drama by adding a time limit to the game, after
which the game ends.

To do this, we'll want to have a variable which stores the current time left.
Every second, we'll run a function which decrease the time left by 1. When we
hit zero, we'll stop the game, and show the player their final score.

24a2 doesn't provide support for running a function every second, but luckily
the browser does. Because 24a2 games are written in JavaScript and run in the
browser, we can access all functionality that the browser provides.

```javascript
// Games last 45 seconds
let timeRemaining = 45;

let interval = setInterval(decreaseTimer, 1000);

function decreaseTimer() {
  timeRemaining--;
  if (timeRemaining == 0) {
    clearInterval(interval);
  }
}
```

To show the time remaining, let's update the call to `game.setText` in `update`:

```javascript
function update(game) {
  // ...
  game.setText(`Time left: ${timeRemaining}s. Score: ${score}`);
}
```

Finally, when the remaining time hits 0, let's end the game:

```javascript
function update(game) {
  // ...

  if (timeRemaining <= 0) {
    game.setText(`Game over! Final score: ${score}`);
    game.end();
  }
}
```

## 8. Next steps

That's our game! It's not super fun, but hopefully you've learnt how to build a
game using 24a2. If you'd like to contine working on your game, here are some
ideas for things to do:

1. Randomise the player's start position
2. Add different items, which give the player different numbers of points
3. Add items which give the player more time
4. Use `localStorage` to store the player's high score, and let them know if
   they've beaten it when the game ends

<!-- prettier-ignore -->
[^1]: The `x` and `y` coordinates are both chosen with the code
      `Math.floor(Math.random() * 24)`. Let's have a quick look at what this is
      doing. 
      
      `Math.random()` returns a number greater than or equal to 0, and
      less than 1. We multiply this by 24, to give us a number greater than or
      equal to 0, and less that 24. This number can inclued a fraction, so we
      use `Math.floor` to remove it. This gives us an integer in the range 0 to
      23 (inclusive).
