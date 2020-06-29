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
  Violet = "VIOLET"
}

enum Direction {
  Left = "LEFT",
  Right = "RIGHT",
  Up = "UP",
  Down = "DOWN"
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
  private _last_timestamp = 0.0; // Time since time origin in milliseconds

  private _dots: Array<Array<Color>>;

  // Variables used when rendering the grid
  private _dotSize = 16;
  private _gapSize = 8;

  private _gridHeight = 24;
  private _gridWidth = 24;

  private _ctx?: CanvasRenderingContext2D;
  private _canvasElement? : HTMLCanvasElement;

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

    let canvas_width =
      this._dotSize * this._gridWidth +
      this._gapSize * (this._gridWidth - 1);
    let canvas_height =
      this._dotSize * this._gridHeight +
      this._gapSize * (this._gridHeight - 1) +
      50;

    // Get canvas element, or create it if it doesn't exist
    let canvasElement = <HTMLCanvasElement> document.getElementById("24a2-canvas");
    if(canvasElement == null) {
      canvasElement = document.createElement("canvas");
      canvasElement.width = canvas_width;
      canvasElement.height = canvas_height;
      canvasElement.id = "24a2-canvas";
      // If GameConfig.containerId is set, append child to it
      // Otherwise, append it to body
      // @Bug: if script is ran before document is loaded, target element might not be loaded
      //       so the canvas is appended to body instead, even if containerId is a valid id
      let parentElement = document.getElementById(this._config.containerId || "") ?? document.body;
      parentElement.appendChild(canvasElement);
    }
    this._canvasElement = canvasElement;

    // Get CanvasRenderingContext2D from the canvasElement
    let context2D = canvasElement.getContext("2d", { alpha: false } );
    if(context2D == null) {
      throw new Error("Couldn't get 2D context from canvas");
    }
    this._ctx = context2D;

    // Canvas is created, call user create function
    if(this._config.create) {
      this._config.create(this);
    }

    // If onDotClicked is provided, add mousedown listener to canvas
    if(this._config.onDotClicked) {
      canvasElement.addEventListener("mousedown", (event : MouseEvent) => {
        const HALFSIZE = this._dotSize / 2;
        const CELLSIZE = this._dotSize + this._gapSize;

        // Get mouse canvas coordinates
        const mx = event.pageX - canvasElement.offsetLeft;
        const my = event.pageY - canvasElement.offsetTop;

        // Get dot grid coordinates
        const gx = Math.floor(mx / CELLSIZE); // Grid-x
        const gy = Math.floor(my / CELLSIZE); // Grid-y

        // Early return, grid coordinate is out-of-bounds
        if(gx < 0 || gx >= this._gridWidth || gy < 0 || gy >= this._gridHeight) {
          return;
        }

        // Get dot center canvas coordinates
        const px = gx * CELLSIZE + HALFSIZE;
        const py = gy * CELLSIZE + HALFSIZE;

        // Get difference between mouse and dot center
        const dx = px - mx;
        const dy = py - my;

        // Get square distance from mouse to center of dot
        // If it's less than square radius, then mouse is inside dot
        // Could be problematic with really small dots?
        if(dx * dx + dy * dy < HALFSIZE * HALFSIZE) {
          // Call user-specified callback function
          if(this._config.onDotClicked) this._config.onDotClicked(gx, gy);
        }
      });
    }

    // If onKeyPress is provided, add mousedown listener to document
    // Attaching to the canvas didn't catch any events
    if(this._config.onKeyPress) {
      let keypressCallback = this._config.onKeyPress;
      document.addEventListener("keydown", (event: KeyboardEvent) => {
        switch(event.keyCode) {
          case 38: keypressCallback(Direction.Up); return false;
          case 40: keypressCallback(Direction.Down); return false;
          case 37: keypressCallback(Direction.Left); return false;
          case 39: keypressCallback(Direction.Right); return false;
          default: return true;
        }
      });
    }

    // Startup the engine loop
    requestAnimationFrame(this._loop.bind(this));
  }

  // Clear canvas by rendering a rect on top of old frame
  private _clearCanvas() {
    if(this._ctx && this._canvasElement) {
      this._ctx.fillStyle = "white";
      this._ctx.fillRect(0, 0, this._canvasElement.width, this._canvasElement.height);
    }
  }

  // Draw text below the grid
  private _drawText() {
    if(!this._ctx) return; // Can't draw text without context

    let textY =
      this._dotSize * this._gridHeight +
      this._gapSize * (this._gridHeight - 1) +
      32;

    this._ctx.font = "18px monospace";
    this._ctx.fillStyle = "black";
    this._ctx.fillText(this._text, 0, textY);
  }

  // Engine loop function
  private _loop(timestamp: number) {
    if(this._ended) return; // Game has ended, stop the engine loop

    // Request next frame if game hasn't ended
    requestAnimationFrame(this._loop.bind(this));

    // Framerate check
    var delta = timestamp - this._last_timestamp;
    if(delta >= 1000.0 / (this._config.frameRate || 24)) {
      delta -= (1000.0 / (this._config.frameRate || 24));
      this._draw();
      this._last_timestamp = (timestamp - delta); // Offset by remaining delta
    }
  }

  private _draw() {
    // Set the internal frame count
    this._frameCount += 1;
    // Clear the canvas
    this._clearCanvas();

    // Clear the grid
    this._clearGrid();

    // Call user update if it's set
    if (this._config.update) {
      this._config.update(this);
    }

    // Draw the grid
    this._drawGrid();

    // Draw the text below the grid
    this._drawText();
  }

  // Draw dot grid
  private _drawGrid() {
    if(!this._ctx) return; // Can't draw grid without context
    let ctx = this._ctx;

    const offset = this._dotSize + this._gapSize;
    const ds = this._dotSize / 2;

    this._dots.forEach((row, y) => {
      row.forEach((dot, x) => {
        ctx.beginPath();
        ctx.fillStyle = this._getCSSColor(dot);
        ctx.ellipse(ds + x * offset, ds + y * offset, ds, ds, 0, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  }

  private _clearGrid() {
    this._dots.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        this.setDot(x, y, Color.Gray);
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

