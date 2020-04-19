enum Color {
  Gray = "GRAY",
  Black = "BLACK",
  Red = "RED"
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
}

interface GameConfig {
  create: (game: Game, grid: Grid) => void;
  update: (game: Game, grid: Grid) => void;
  onKeyPress: (direction: Direction) => void;
}

class Game {
  private _config: GameConfig;
  // TODO: make these private
  private _grid: Grid;
  private _text: string;
  private _frameRate: number;
  private _ended: boolean;

  constructor(config: GameConfig) {
    this._config = config;
    this._grid = new Grid();
    this._text = "";
    this._frameRate = 24;
    this._ended = false;
  }

  setText(text: string): void {
    this._text = text;
  }

  setFrameRate(rate: number): void {
    this._frameRate = rate;
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

          this._config.create(this, this._grid);
        }.bind(this);

        p.draw = function(this: Game) {
          if (this._ended) {
            p.noLoop();
            return;
          }
          p.clear();
          // TODO: we could only set this if it's changed
          p.frameRate(this._frameRate);
          this._config.update(this, this._grid);
          drawGrid(this._grid);

          p.push();
          p.textFont("monospace");
          p.textSize(18);
          p.text(this._text, 42, 640);
          p.pop();
        }.bind(this);

        p.keyPressed = function(this: Game) {
          // TODO: use WASD instead of arrow keys - they don't have a meaning
          // in the browser
          if (p.keyCode === p.LEFT_ARROW) {
            this._config.onKeyPress(Direction.Left);
          }

          if (p.keyCode === p.RIGHT_ARROW) {
            this._config.onKeyPress(Direction.Right);
          }

          if (p.keyCode === p.UP_ARROW) {
            this._config.onKeyPress(Direction.Up);
          }

          if (p.keyCode === p.DOWN_ARROW) {
            this._config.onKeyPress(Direction.Down);
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
      default:
        console.error("no CSS color defined");
        return "orange";
    }
  }
}
