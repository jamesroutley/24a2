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

  clear() {
    for (let y = 0; y < 24; y++) {
      for (let x = 0; x < 24; x++) {
        this.setDot(x, y, Color.Gray);
      }
    }
  }
}

interface GameConfig {
  create?: (game: Game, grid: Grid) => void;
  update?: (game: Game, grid: Grid) => void;
  onKeyPress?: (direction: Direction) => void;
  onDotClicked?: (x: number, y: number) => void;
}

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

  setText(text: string): void {
    this._text = text;
  }

  setFrameRate(rate: number): void {
    this._frameRate = rate;
  }

  getFrameCount(): number {
    return this._frameCount;
  }

  end(): void {
    this._ended = true;
  }

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

  _getCSSColor(color: Color): string {
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
