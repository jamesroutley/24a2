enum Color {
  Gray = "GRAY",
  Black = "BLACK",
  Red = "RED",
  Green = "GREEN",
  Yellow = "YELLOW"
}

enum Direction {
  Left = "LEFT",
  Right = "RIGHT",
  Up = "UP",
  Down = "DOWN"
}

class Grid {
  private _dotSize: number;
  private _gap: number;
  private _gridSize: number;

  // HACK: this variable is named like a private variable but isn't actually
  // private because we use it in Game
  // TODO: fix
  _dots: Array<Array<Color>>;
  constructor() {
    this._dotSize = 16;
    this._gap = 8;
    this._gridSize = 24;
    this._dots = new Array(this._gridSize);
    for (let y = 0; y < this._gridSize; y++) {
      let row = new Array(this._gridSize);
      for (let i = 0; i < row.length; i++) {
        row[i] = Color.Gray;
      }
      this._dots[y] = row;
    }
  }

  _getDotSize(): number {
    return this._dotSize;
  }

  _getOffset(): number {
    return this._dotSize + this._gap;
  }

  _getGridSize(): number {
    return this._gridSize;
  }

  getDot(x: number, y: number): Color {
    return this._dots[y][x];
  }

  setDot(x: number, y: number, val: Color) {
    this._dots[y][x] = val;
  }

  _clear() {
    for (let y = 0; y < 24; y++) {
      for (let x = 0; x < 24; x++) {
        this.setDot(x, y, Color.Gray);
      }
    }
  }
}

/**
 * GameConfig is the object you pass when contructing a new {@link Game}.
 */
interface GameConfig {
  /**
   * `create` is a function which is called once, just before the game starts
   * running. You can use it to initialise game state, if needed.
   */
  create?: (game: Game, grid: Grid) => void;
  /**
   * `update` is repeatedly called as the game runs. You can use it to define
   * the main functionality of your game.
   */
  update?: (game: Game, grid: Grid) => void;
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
  // TODO: make these private
  private _grid: Grid;
  private _text: string;
  private _frameRate: number;
  private _ended: boolean;
  private _frameCount: number;

  constructor(config: GameConfig) {
    this._config = config;
    this._grid = new Grid();
    this._text = "";
    this._frameRate = 24;
    this._ended = false;
    this._frameCount = 0;
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
   * Sets the frame rate of the game. This is set to 24 by default. The frame
   * rate defines how frequently the `update` function is called - by default
   * it's called 24 times per second.
   */
  setFrameRate(rate: number): void {
    this._frameRate = rate;
  }

  /**
   * Returns the number of frames that have passed since the game started. The
   * speed at which this increases is dependent on the frame rate. The higher
   * the frame rate is, the faster this number will increment, and vice versa.
   * You can set the frame rate with {@Link Game.setFrameRate}.
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
   * Calling `run` starts the game.
   */
  run() {
    new p5(
      function(this: Game, p: p5) {
        const drawGrid = (grid: Grid) => {
          const offset = grid._getOffset();
          const dotSize = grid._getDotSize();
          p.push();
          p.translate(50, 50);
          grid._dots.forEach((row, y) => {
            row.forEach((dot, x) => {
              p.fill(p.color(this._getCSSColor(dot)));
              p.circle(x * offset, y * offset, dotSize);
            });
          });
          p.pop();
        };

        p.setup = function(this: Game) {
          // TODO canvas size is a bit arbitrary
          p.createCanvas(652, 652);
          // Don't draw outlines around circles
          p.noStroke();

          if (this._config.create) {
            this._config.create(this, this._grid);
          }
        }.bind(this);

        p.draw = function(this: Game) {
          this._frameCount = p.frameCount;
          if (this._ended) {
            p.noLoop();
            return;
          }
          p.clear();

          // TODO: we could only set this if it's changed
          p.frameRate(this._frameRate);

          this._grid._clear();

          if (this._config.update) {
            this._config.update(this, this._grid);
          }

          drawGrid(this._grid);

          p.push();
          p.textFont("monospace");
          p.textSize(18);
          p.text(this._text, 42, 640);
          p.pop();
        }.bind(this);

        p.keyPressed = function(this: Game): boolean {
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

        p.mouseClicked = function(this: Game) {
          if (!this._config.onDotClicked) {
            return;
          }
          const offset = this._grid._getOffset();
          const dotSize = this._grid._getDotSize();
          // Iterate over all dot locations, and check whether the distance
          // between the click and the dot centre is less than the dot's
          // radius
          for (let y = 0; y < 24; y++) {
            for (let x = 0; x < 24; x++) {
              const dx = 50 + x * offset;
              const dy = 50 + y * offset;

              // p.mouseX and p.mouseY give is the coordinates in the canvas
              // space.
              const distance = p.dist(dx, dy, p.mouseX, p.mouseY);

              if (distance < dotSize / 2) {
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

  private _getCSSColor(color: Color): string {
    switch (color) {
      case Color.Gray:
        return "gainsboro";
      case Color.Black:
        return "black";
      case Color.Red:
        return "red";
      case Color.Green:
        return "green";
      case Color.Yellow:
        return "gold";
      default:
        console.error("no CSS color defined");
        return "orange";
    }
  }
}
