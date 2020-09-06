---
id: "gameconfig"
title: "GameConfig"
sidebar_label: "GameConfig"
---

GameConfig is the object you pass when contructing a new [Game](../../classes/game).

## Hierarchy

* **GameConfig**

## Index

### Properties

* [clearGrid](../gameconfig#optional-cleargrid)
* [containerId](../gameconfig#optional-containerid)
* [create](../gameconfig#optional-create)
* [defaultDotColor](../gameconfig#optional-defaultdotcolor)
* [frameRate](../gameconfig#optional-framerate)
* [gridHeight](../gameconfig#optional-gridheight)
* [gridWidth](../gameconfig#optional-gridwidth)
* [onDotClicked](../gameconfig#optional-ondotclicked)
* [onKeyPress](../gameconfig#optional-onkeypress)
* [update](../gameconfig#optional-update)

## Properties

### `Optional` clearGrid

• **clearGrid**? : *undefined | false | true*

Specifies whether 24a2 should clear the grid at the beginning of each
frame. 24a2 clears the grid by setting the colour of every dot to
[GameConfig.defaultDotColor](../gameconfig#optional-defaultdotcolor). Setting clearGrid to false lets you
simplify the code for some games by letting 24a2 store the state for each
dot. You can use [Game.getDot](../../classes/game#getdot) to read back the colour of dots. By
default, this is set to true.

___

### `Optional` containerId

• **containerId**? : *undefined | string*

The ID of a container to create the canvas in.

___

### `Optional` create

• **create**? : *undefined | function*

`create(game)` is a function which is called once, just before the game
starts running. You can use it to initialise game state, if needed.

___

### `Optional` defaultDotColor

• **defaultDotColor**? : *[Color](../../enums/color)*

Set the default color of the dots. By default, this is set to
[Color.Gray](../../enums/color#gray).

___

### `Optional` frameRate

• **frameRate**? : *undefined | number*

Sets the game's frame rate. By default, this is set to 24.

___

### `Optional` gridHeight

• **gridHeight**? : *undefined | number*

Sets the height of the grid. By default, this is set to 24.

___

### `Optional` gridWidth

• **gridWidth**? : *undefined | number*

Sets the width of the grid. By default, this is set to 24.

___

### `Optional` onDotClicked

• **onDotClicked**? : *undefined | function*

`onDotClicked(x, y)` is a function which is called when the player clicks
on a dot.

___

### `Optional` onKeyPress

• **onKeyPress**? : *undefined | function*

`onKeyPress(direction)` is a function which is called when the player
presses one of the arrow keys.

___

### `Optional` update

• **update**? : *undefined | function*

`update(game)` is repeatedly called as the game runs. You can use it to
define the main functionality of your game.
