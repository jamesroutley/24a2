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

* [containerId](../gameconfig#optional-containerid)
* [create](../gameconfig#optional-create)
* [onDotClicked](../gameconfig#optional-ondotclicked)
* [onKeyPress](../gameconfig#optional-onkeypress)
* [update](../gameconfig#optional-update)

## Properties

### `Optional` containerId

• **containerId**? : *undefined | string*

The ID of a container to create the canvas in

___

### `Optional` create

• **create**? : *undefined | function*

`create` is a function which is called once, just before the game starts
running. You can use it to initialise game state, if needed.

___

### `Optional` onDotClicked

• **onDotClicked**? : *undefined | function*

`onDotClicked` is a function which is called when the player clicks on a
dot.

___

### `Optional` onKeyPress

• **onKeyPress**? : *undefined | function*

`onKeyPress` is a function which is called when the player presses one of
the arrow keys.

___

### `Optional` update

• **update**? : *undefined | function*

`update` is repeatedly called as the game runs. You can use it to define
the main functionality of your game.
