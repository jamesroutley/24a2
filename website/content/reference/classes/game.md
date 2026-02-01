[**24a2**](../../README)

***

# Class: Game

Game is the object that controls the actual running of the game. You
create a new one by passing in a [GameConfig](../../interfaces/GameConfig). Calling `game.run()`
will start the game.

```javascript
let config = {
   create: create, // A function you've defined
   update: update, // A function you've defined
}

let game = new Game(config)
game.run()
```

## Constructors

### Constructor

> **new Game**(`config`): `Game`

#### Parameters

##### config

[`GameConfig`](../../interfaces/GameConfig)

#### Returns

`Game`

## Methods

### end()

> **end**(): `void`

Calling `end` stops the game loop. You should call it when the game is
finished. After you call it, the game is rendered one final time. Because
of this, you often want to `return` just after you call `game.end()` to
make sure any code after it is executed.

#### Returns

`void`

***

### getDot()

> **getDot**(`x`, `y`): [`Color`](../../enumerations/Color)

Returns the color of a dot.

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

[`Color`](../../enumerations/Color)

***

### getFrameCount()

> **getFrameCount**(): `number`

Returns the number of frames that have passed since the game started. The
speed at which this increases is dependent on the frame rate. The higher
the frame rate is, the faster this number will increment, and vice versa.
You can set the frame rate with [GameConfig.frameRate](../../interfaces/GameConfig#framerate).

You can use this function to do things like increase difficulty as time
goes on.

#### Returns

`number`

***

### run()

> **run**(): `void`

Calling `run` starts the game.

#### Returns

`void`

***

### setDot()

> **setDot**(`x`, `y`, `val`): `void`

Sets the color of a dot.

#### Parameters

##### x

`number`

##### y

`number`

##### val

[`Color`](../../enumerations/Color)

#### Returns

`void`

***

### setText()

> **setText**(`text`): `void`

24a2 games have a line of text below the grid which can be set to show
information to the player. This is commonly used to show instructions or
the player's score. Use this function to set that text.

#### Parameters

##### text

`string`

#### Returns

`void`
