/**
 * Color is a set of constants which you can use to set the color of dots.
 *
 * Use it from both TypeScript and JavaScript with:
 *
 * ```javascript
 * game.setDot(x, y, Color.Red)
 * ```
 */
enum Color {
  Gray = "GRAY",
  Black = "BLACK",
  Red = "RED",
  Orange = "ORANGE",
  Yellow = "YELLOW",
  Green = "GREEN",
  Blue = "BLUE",
  Indigo = "INDIGO",
  Violet = "VIOLET",
}

enum Direction {
  Left = "LEFT",
  Right = "RIGHT",
  Up = "UP",
  Down = "DOWN",
}

/**
 * GameConfig is the object you pass when contructing a new {@link Game}.
 */
interface GameConfig {
  /**
   * `create` is a function which is called once, just before the game starts
   * running. You can use it to initialise game state, if needed.
   */
  create?: (game: Game) => void;
  /**
   * `update` is repeatedly called as the game runs. You can use it to define
   * the main functionality of your game.
   */
  update?: (game: Game) => void;
  /**
   * `onKeyPress` is a function which is called when the player presses one of
   * the arrow keys.
   */
  onKeyPress?: (direction: Direction) => void;
  /**
   * `onDotClicked` is a function which is called when the player clicks on a
   * dot.
   */
  onDotClicked?: (x: number, y: number) => void;
  /**
   * The ID of a container to create the canvas in
   */
  containerId?: string;

  /**
   * Sets the game's frame rate. By default, this is set to 24.
   */
  frameRate?: number;

  /**
   * Set the default color of the dots. By default, this is set to
   * {@Link Color.Gray}.
   */
  defaultDotColor?: Color;

  /**
   *
   * Sets the width of the grid. By default, this is set to 24.
   */
  gridWidth?: number;

  /**
   *
   * Sets the height of the grid. By default, this is set to 24.
   */
  gridHeight?: number;

  /**
   * @ignore
   */
  _gridWidth?: number;
  /**
   * @ignore
   */
  _gridHeight?: number;

  /**
   * Specifies whether 24a2 should clear the grid at the beginning of each
   * frame. 24a2 clears the grid by setting the colour of every dot to
   * {@Link GameConfig.defaultDotColor}. Setting clearGrid to false lets you
   * simplify the code for some games by letting 24a2 store the state for each
   * dot. You can use {@Link Game.getDot} to read back the colour of dots. By
   * default, this is set to true.
   */
  clearGrid?: boolean;
}

/**
 * @ignore
 * Renderer is the interface used by {@Link Game} to draw the dots.
 */
interface Renderer {
  setDot: (x: number, y: number, val: Color) => void;
  setText: (text: string) => void;
}

class P5Renderer {
  private _gridHeight = 24;
  private _gridWidth = 24;
  private _text = "";
  private _dots: Array<Array<Color>>;

  // Variables used when rendering the grid
  private _dotSize = 16;
  private _gapSize = 8;

  constructor(gridHeight: number, gridWidth: number, containerId?: string) {
    this._gridHeight = gridHeight;
    this._gridWidth = gridWidth;

    // Initialise internal dot store
    this._dots = new Array(this._gridHeight);
    for (let y = 0; y < this._dots.length; y++) {
      let row = new Array(this._gridWidth);
      for (let i = 0; i < row.length; i++) {
        row[i] = Color.Gray;
      }
      this._dots[y] = row;
    }

    // Start P5
    // This implementation is inefficient because of P5's API - we're also
    // running the P5 update loop alongside our internal update loop
    let parentElement = undefined;
    if (containerId) {
      parentElement = document.getElementById(containerId) || undefined;
    }

    new p5(
      function (this: P5Renderer, p: p5) {
        p.setup = function (this: P5Renderer) {
          let width =
            this._dotSize * this._gridWidth +
            this._gapSize * (this._gridWidth - 1);
          let height =
            this._dotSize * this._gridHeight +
            this._gapSize * (this._gridHeight - 1) +
            50;
          p.createCanvas(width, height);

          // Don't draw outlines around circles
          p.noStroke();

          // TODO: maybe we should just make this much greater than the 24a2
          // frame rate to avoid stuttering issues?
          p.frameRate(24);
        }.bind(this);

        p.draw = function (this: P5Renderer) {
          // Clear the drawing
          p.clear();
          // Draw the grid
          this._drawGrid(p);

          // Draw the text
          p.push();
          p.textFont("monospace");
          p.textSize(18);
          let textY =
            this._dotSize * this._gridHeight +
            this._gapSize * (this._gridHeight - 1) +
            32;
          p.text(this._text, 0, textY);
          p.pop();
        }.bind(this);
      }.bind(this),
      parentElement
    );
  }

  private _drawGrid(p: p5) {
    const offset = this._dotSize + this._gapSize;
    p.push();
    p.translate(this._dotSize / 2, this._dotSize / 2);
    this._dots.forEach((row, y) => {
      row.forEach((dot, x) => {
        p.fill(p.color(this._getCSSColor(dot)));
        p.circle(x * offset, y * offset, this._dotSize);
      });
    });
    p.pop();
  }

  private _getCSSColor(color: Color): string {
    switch (color) {
      case Color.Gray:
        return "gainsboro";
      case Color.Black:
        return "black";
      case Color.Red:
        return "red";
      case Color.Orange:
        return "orange";
      case Color.Yellow:
        return "gold";
      case Color.Green:
        return "green";
      case Color.Blue:
        return "blue";
      case Color.Indigo:
        return "indigo";
      case Color.Violet:
        return "violet";
      default:
        console.error(`no CSS color defined for ${color}`);
        return "";
    }
  }

  setDot(x: number, y: number, val: Color): void {
    if (y < 0 || y >= this._dots.length) {
      throw new Error(
        `P5Renderer: Error trying to set dot (${x}, ${y}): y is out of bounds`
      );
    }
    if (x < 0 || x >= this._dots[y].length) {
      throw new Error(
        `P5Renderer: Error trying to set dot (${x}, ${y}): x is out of bounds`
      );
    }
    this._dots[y][x] = val;
  }

  setText(text: string): void {
    this._text = text;
  }
}

/**
 * Game is the object that controls the actual running of the game. You
 * create a new one by passing in a {@Link GameConfig}. Calling `game.run()`
 * will start the game.
 *
 * ```javascript
 * let config = {
 *    create: create, // A function you've defined
 *    update: update, // A function you've defined
 * }
 *
 * let game = new Game(config)
 * game.run()
 * ```
 */
class Game {
  private _config: GameConfig;

  private _text = "";
  private _ended = false;
  private _frameCount = 0;

  private _dots: Array<Array<Color>>;

  // Variables used when rendering the grid
  private _dotSize = 16;
  private _gapSize = 8;

  private _gridHeight = 24;
  private _gridWidth = 24;

  private _clear = true;

  private _renderer?: Renderer;

  private _interval?: number;

  constructor(config: GameConfig) {
    this._config = config;

    // Retain support for the deprecated _gridHeight and _gridWidth config
    // options
    if (config._gridHeight && config._gridHeight > 0) {
      console.log(
        "The config option _gridHeight is deprecated, please use gridHeight instead"
      );
      this._gridHeight = config._gridHeight;
    }
    if (config._gridWidth && config._gridWidth > 0) {
      console.log(
        "The config option _gridWidth is deprecated, please use gridWidth instead"
      );
      this._gridWidth = config._gridWidth;
    }

    if (config.gridHeight && config.gridHeight > 0) {
      this._gridHeight = config.gridHeight;
    }
    if (config.gridWidth && config.gridWidth > 0) {
      this._gridWidth = config.gridWidth;
    }

    if (config.clearGrid === false) {
      this._clear = false;
    }

    // TODO: remove 24s here? I think we already default them
    this._dots = new Array(this._gridHeight || 24);
    for (let y = 0; y < this._dots.length; y++) {
      let row = new Array(this._gridWidth || 24);
      for (let i = 0; i < row.length; i++) {
        // TODO: should be config.defaultDotColor?
        row[i] = Color.Gray;
      }
      this._dots[y] = row;
    }
  }

  /**
   * 24a2 games have a line of text below the grid which can be set to show
   * information to the player. This is commonly used to show instructions or
   * the player's score. Use this function to set that text.
   */
  setText(text: string): void {
    this._text = text;
  }

  /**
   * Returns the number of frames that have passed since the game started. The
   * speed at which this increases is dependent on the frame rate. The higher
   * the frame rate is, the faster this number will increment, and vice versa.
   * You can set the frame rate with {@Link GameConfig.frameRate}.
   *
   * You can use this function to do things like increase difficulty as time
   * goes on.
   */
  getFrameCount(): number {
    return this._frameCount;
  }

  /**
   * Calling `end` stops the game loop. You should call it when the game is
   * finished. After you call it, the game is rendered one final time. Because
   * of this, you often want to `return` just after you call `game.end()` to
   * make sure any code after it is executed.
   */
  end(): void {
    this._ended = true;
  }

  /**
   * Returns the color of a dot.
   */
  getDot(x: number, y: number): Color {
    if (y < 0 || y >= this._dots.length) {
      throw new Error(
        `Error trying to get dot (${x}, ${y}): y is out of bounds`
      );
    }
    if (x < 0 || x >= this._dots[y].length) {
      throw new Error(
        `Error trying to get dot (${x}, ${y}): x is out of bounds`
      );
    }

    return this._dots[y][x];
  }

  /**
   * Sets the color of a dot.
   */
  setDot(x: number, y: number, val: Color) {
    if (y < 0 || y >= this._dots.length) {
      throw new Error(
        `Error trying to set dot (${x}, ${y}): y is out of bounds`
      );
    }
    if (x < 0 || x >= this._dots[y].length) {
      throw new Error(
        `Error trying to set dot (${x}, ${y}): x is out of bounds`
      );
    }

    this._dots[y][x] = val;
  }

  /**
   * Calling `run` starts the game.
   */
  run() {
    if (!this._renderer) {
      this._renderer = new P5Renderer(
        this._gridHeight,
        this._gridWidth,
        this._config.containerId
      );
    }

    if (this._config.create) {
      this._config.create(this);
      this._render();
    }

    // Initialise a `setInterval` to call a render func every X milliseconds
    // Delay is in milliseconds
    const delay = 1000 / (this._config.frameRate || 24);
    this._interval = window.setInterval(this._update.bind(this), delay);

    this._listenForInput();
  }

  /**
   * The internal function that's called on every frame.
   */
  private _update() {
    if (this._ended) {
      window.clearInterval(this._interval);
      return;
    }
    this._frameCount++;
    if (this._clear) {
      this._clearGrid();
    }
    if (this._config.update) {
      this._config.update(this);
    }
    this._render();
  }

  private _clearGrid() {
    this._dots.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        this.setDot(x, y, this._config.defaultDotColor || Color.Gray);
      }
    });
  }

  private _render() {
    this._dots.forEach((row, y) => {
      row.forEach((dot, x) => {
        // TODO: don't perform this check every time
        if (!this._renderer) {
          console.error("renderer undefined");
          return;
        }
        this._renderer.setDot(x, y, dot);
      });
    });
    this._renderer?.setText(this._text);
  }

  /**
   * This function sets up listeners for keyboard and mouse input. We
   * currently use P5 for this
   * TODO: switch to native functions
   */
  _listenForInput() {
    new p5(
      function (this: Game, p: p5) {
        p.keyPressed = function (this: Game): boolean {
          if (!this._config.onKeyPress) {
            // Return true to not prevent the browser's default behaviour for
            // this keypress
            return true;
          }
          // TODO: use WASD instead of arrow keys - they don't have a meaning
          // in the browser
          if (p.keyCode === p.LEFT_ARROW) {
            this._config.onKeyPress(Direction.Left);
            return false;
          }

          if (p.keyCode === p.RIGHT_ARROW) {
            this._config.onKeyPress(Direction.Right);
            return false;
          }

          if (p.keyCode === p.UP_ARROW) {
            this._config.onKeyPress(Direction.Up);
            return false;
          }

          if (p.keyCode === p.DOWN_ARROW) {
            this._config.onKeyPress(Direction.Down);
            return false;
          }
          return true;
        }.bind(this);

        p.mouseClicked = function (this: Game) {
          if (!this._config.onDotClicked) {
            return;
          }
          const offset = this._dotSize + this._gapSize;
          // Iterate over all dot locations, and check whether the distance
          // between the click and the dot centre is less than the dot's
          // radius
          for (let y = 0; y < this._dots.length; y++) {
            let row = this._dots[y];
            for (let x = 0; x < row.length; x++) {
              const dx = this._dotSize / 2 + x * offset;
              const dy = this._dotSize / 2 + y * offset;

              // p.mouseX and p.mouseY give is the coordinates in the canvas
              // space.
              const distance = p.dist(dx, dy, p.mouseX, p.mouseY);

              if (distance < this._dotSize / 2) {
                this._config.onDotClicked(x, y);
                // We've found the dot, so exit early
                return;
              }
            }
          }
        }.bind(this);
      }.bind(this)
    );
  }
}
