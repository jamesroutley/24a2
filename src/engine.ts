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
   * @ignore
   *
   * Sets the width of the grid
   */
  _gridWidth?: number;
  /**
   * @ignore
   *
   * Sets the height of the grid
   */
  _gridHeight?: number;
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

  constructor(config: GameConfig) {
    this._config = config;

    if (config._gridHeight && config._gridHeight > 0) {
      this._gridHeight = config._gridHeight;
    }

    if (config._gridWidth && config._gridWidth > 0) {
      this._gridWidth = config._gridWidth;
    }

    this._dots = new Array(this._gridHeight || 24);
    for (let y = 0; y < this._dots.length; y++) {
      let row = new Array(this._gridWidth || 24);
      for (let i = 0; i < row.length; i++) {
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
    // TODO: there's probably a nicer way of expressing this
    let parentElement = undefined;
    if (this._config.containerId) {
      parentElement =
        document.getElementById(this._config.containerId) || undefined;
    }

    new p5(
      function (this: Game, p: p5) {
        p.setup = function (this: Game) {
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

          p.frameRate(this._config.frameRate || 24);

          if (this._config.create) {
            this._config.create(this);
          }
        }.bind(this);

        p.draw = function (this: Game) {
          // Set the internal frame count to P5's frame count. This lets us
          // return the frame count in `getFrameCount`
          this._frameCount = p.frameCount;

          // If the game has ended, end the P5 iteration and exit.
          if (this._ended) {
            p.noLoop();
            return;
          }

          // Clear the drawing
          p.clear();
          this._clearGrid();

          if (this._config.update) {
            this._config.update(this);
          }

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

  private _clearGrid() {
    this._dots.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        this.setDot(x, y, this._config.defaultDotColor || Color.Gray);
      }
    });
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
}
