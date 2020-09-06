# Abstracting the presentation layer

24a2 is currently closely coupled with [P5.js](https://p5js.org/), a HTML canvas
drawing library. Amongst other things, 24a2 uses P5 to:

- Draw dots to the Canvas
- Draw the line of text a game can set

This makes 24a2 difficult to test, because the output of the game engine is
shapes drawn to a Canvas, and making assertions about what's drawn to a Canvas
is difficult.

I think we should introduce a new `Renderer` abstraction, which is would have a
very basic interface for drawing dots and text to an arbitrary visual interface.
To start with, we'd only support an HTML canvas renderer (which would probably
use P5 under the hood to start with). This would be called by the `Game` object
at the end of each `update` function call to actually render the current state
of the game.

## Interface

```typescript
interface Renderer {
  setDot: (x: number, y: number, val: Color) => void;
  setText: (text: string) => void;
  // TODO: maybe we don't need this?
  render: () => void;
}
```

We'll also write a concrete implementation of an HTML canvas renderer:

```typescript
class CanvasRenderer {
  constructor(containerID?: string, gridHeight: number, gridWidth: number) {}

  setDot(x: number, y: number, val: Color): void {}

  setText(text: string): void {}
}
```

We can also write a mock implementation:

```typescript
class MockRenderer {
  constructor(gridHeight: number, gridWidth: number) {}

  setDot(x: number, y: number, val: Color): void {}

  setText(text: string): void {}
}
```

This mock implementation will store a `gridWidth` by `gridHeight` matrix of
dots, and expose functions which let you assert the current state of those dots.
It'll expose similar functions for asserting the text stored.

## API changes

The `Game` object will instantiate the CanvasRenderer by default, and will store
it as `game._renderer`. In tests, we'll be able to set this value to a renderer
of our choice.

Eventually, we can support setting a renderer explicitly in `Game`'s
constructor, or via `GameConfig`, but I think it's worth not making any API
changes for the time being.

## Game loop

Currently, the game loop (i.e. calling `update` every frame) is managed by P5.
We'll need to reimplement the game loop in plain JavaScript

The `Game` object would then:

- On `game.run()`, we'd call the user defined `create` function
- Set up a `window.setInterval` to call `update` every `1/frame rate` seconds
- On `game.end()`, we can call `clearInterval` to stop `setInterval` from
  running

## Testing

Once we've abstracted out both input and rendering methods, testing should
hopefully become simpler, because we can step through the running of a game, and
assert the internal state of the dots at each step.
