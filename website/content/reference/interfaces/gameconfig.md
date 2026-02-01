[**24a2**](../../README)

***

# Interface: GameConfig

GameConfig is the object you pass when contructing a new [Game](../../classes/Game).

## Properties

### clearGrid?

> `optional` **clearGrid**: `boolean`

Specifies whether 24a2 should clear the grid at the beginning of each
frame. 24a2 clears the grid by setting the colour of every dot to
[GameConfig.defaultDotColor](../#defaultdotcolor). Setting clearGrid to false lets you
simplify the code for some games by letting 24a2 store the state for each
dot. You can use [Game.getDot](../../classes/Game#getdot) to read back the colour of dots. By
default, this is set to true.

***

### containerId?

> `optional` **containerId**: `string`

The ID of a container to create the canvas in.

***

### create()?

> `optional` **create**: (`game`) => `void`

`create(game)` is a function which is called once, just before the game
starts running. You can use it to initialise game state, if needed.

#### Parameters

##### game

[`Game`](../../classes/Game)

#### Returns

`void`

***

### defaultDotColor?

> `optional` **defaultDotColor**: [`Color`](../../enumerations/Color)

Set the default color of the dots. By default, this is set to
[Color.Gray](../../enumerations/Color#gray).

***

### frameRate?

> `optional` **frameRate**: `number`

Sets the game's frame rate. By default, this is set to 24.

***

### gridHeight?

> `optional` **gridHeight**: `number`

Sets the height of the grid. By default, this is set to 24.

***

### gridWidth?

> `optional` **gridWidth**: `number`

Sets the width of the grid. By default, this is set to 24.

***

### onDotClicked()?

> `optional` **onDotClicked**: (`x`, `y`) => `void`

`onDotClicked(x, y)` is a function which is called when the player clicks
on a dot.

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`void`

***

### onKeyPress()?

> `optional` **onKeyPress**: (`direction`) => `void`

`onKeyPress(direction)` is a function which is called when the player
presses one of the arrow keys.

#### Parameters

##### direction

[`Direction`](../../enumerations/Direction)

#### Returns

`void`

***

### update()?

> `optional` **update**: (`game`) => `void`

`update(game)` is repeatedly called as the game runs. You can use it to
define the main functionality of your game.

#### Parameters

##### game

[`Game`](../../classes/Game)

#### Returns

`void`
