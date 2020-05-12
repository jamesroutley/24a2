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
* [getFrameCount](../game#getframecount)
* [run](../game#run)
* [setFrameRate](../game#setframerate)
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

###  getFrameCount

▸ **getFrameCount**(): *number*

Returns the number of frames that have passed since the game started. The
speed at which this increases is dependent on the frame rate. The higher
the frame rate is, the faster this number will increment, and vice versa.
You can set the frame rate with [Game.setFrameRate](../game#setframerate).

You can use this function to do things like increase difficulty as time
goes on.

**Returns:** *number*

___

###  run

▸ **run**(): *void*

Calling `run` starts the game.

**Returns:** *void*

___

###  setFrameRate

▸ **setFrameRate**(`rate`: number): *void*

Sets the frame rate of the game. This is set to 24 by default. The frame
rate defines how frequently the `update` function is called - by default
it's called 24 times per second.

**Parameters:**

Name | Type |
------ | ------ |
`rate` | number |

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
