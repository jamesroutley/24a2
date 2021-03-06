---
id: "game"
title: "Game"
sidebar_label: "Game"
---

Game is the object that controls the actual running of the game. You
create a new one by passing in a [GameConfig](../../interfaces/gameconfig). Calling `game.run()`
will start the game.

```javascript
let config = {
   create: create, // A function you've defined
   update: update, // A function you've defined
}

let game = new Game(config)
game.run()
```

## Hierarchy

* **Game**

## Index

### Constructors

* [constructor](../game#constructor)

### Methods

* [end](../game#end)
* [getDot](../game#getdot)
* [getFrameCount](../game#getframecount)
* [run](../game#run)
* [setDot](../game#setdot)
* [setText](../game#settext)

## Constructors

###  constructor

\+ **new Game**(`config`: [GameConfig](../../interfaces/gameconfig)): *[Game](../game)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | [GameConfig](../../interfaces/gameconfig) |

**Returns:** *[Game](../game)*

## Methods

###  end

▸ **end**(): *void*

Calling `end` stops the game loop. You should call it when the game is
finished. After you call it, the game is rendered one final time. Because
of this, you often want to `return` just after you call `game.end()` to
make sure any code after it is executed.

**Returns:** *void*

___

###  getDot

▸ **getDot**(`x`: number, `y`: number): *[Color](../../enums/color)*

Returns the color of a dot.

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *[Color](../../enums/color)*

___

###  getFrameCount

▸ **getFrameCount**(): *number*

Returns the number of frames that have passed since the game started. The
speed at which this increases is dependent on the frame rate. The higher
the frame rate is, the faster this number will increment, and vice versa.
You can set the frame rate with [GameConfig.frameRate](../../interfaces/gameconfig#optional-framerate).

You can use this function to do things like increase difficulty as time
goes on.

**Returns:** *number*

___

###  run

▸ **run**(): *void*

Calling `run` starts the game.

**Returns:** *void*

___

###  setDot

▸ **setDot**(`x`: number, `y`: number, `val`: [Color](../../enums/color)): *void*

Sets the color of a dot.

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |
`val` | [Color](../../enums/color) |

**Returns:** *void*

___

###  setText

▸ **setText**(`text`: string): *void*

24a2 games have a line of text below the grid which can be set to show
information to the player. This is commonly used to show instructions or
the player's score. Use this function to set that text.

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |

**Returns:** *void*
