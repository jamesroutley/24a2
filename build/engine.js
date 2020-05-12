"use strict";
var Color;
(function (Color) {
    Color["Gray"] = "GRAY";
    Color["Black"] = "BLACK";
    Color["Red"] = "RED";
    Color["Green"] = "GREEN";
    Color["Yellow"] = "YELLOW";
})(Color || (Color = {}));
var Direction;
(function (Direction) {
    Direction["Left"] = "LEFT";
    Direction["Right"] = "RIGHT";
    Direction["Up"] = "UP";
    Direction["Down"] = "DOWN";
})(Direction || (Direction = {}));
var Grid = /** @class */ (function () {
    function Grid() {
        this._dotSize = 16;
        this._gap = 8;
        this._gridSize = 24;
        this._dots = new Array(this._gridSize);
        for (var y = 0; y < this._gridSize; y++) {
            var row = new Array(this._gridSize);
            for (var i = 0; i < row.length; i++) {
                row[i] = Color.Gray;
            }
            this._dots[y] = row;
        }
    }
    Grid.prototype._getDotSize = function () {
        return this._dotSize;
    };
    Grid.prototype._getOffset = function () {
        return this._dotSize + this._gap;
    };
    Grid.prototype._getGridSize = function () {
        return this._gridSize;
    };
    Grid.prototype.getDot = function (x, y) {
        return this._dots[y][x];
    };
    Grid.prototype.setDot = function (x, y, val) {
        this._dots[y][x] = val;
    };
    Grid.prototype._clear = function () {
        for (var y = 0; y < 24; y++) {
            for (var x = 0; x < 24; x++) {
                this.setDot(x, y, Color.Gray);
            }
        }
    };
    return Grid;
}());
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
var Game = /** @class */ (function () {
    function Game(config) {
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
    Game.prototype.setText = function (text) {
        this._text = text;
    };
    /**
     * Sets the frame rate of the game. This is set to 24 by default. The frame
     * rate defines how frequently the `update` function is called - by default
     * it's called 24 times per second.
     */
    Game.prototype.setFrameRate = function (rate) {
        this._frameRate = rate;
    };
    /**
     * Returns the number of frames that have passed since the game started. The
     * speed at which this increases is dependent on the frame rate. The higher
     * the frame rate is, the faster this number will increment, and vice versa.
     * You can set the frame rate with {@Link Game.setFrameRate}.
     *
     * You can use this function to do things like increase difficulty as time
     * goes on.
     */
    Game.prototype.getFrameCount = function () {
        return this._frameCount;
    };
    /**
     * Calling `end` stops the game loop. You should call it when the game is
     * finished. After you call it, the game is rendered one final time. Because
     * of this, you often want to `return` just after you call `game.end()` to
     * make sure any code after it is executed.
     */
    Game.prototype.end = function () {
        this._ended = true;
    };
    /**
     * Calling `run` starts the game.
     */
    Game.prototype.run = function () {
        new p5(function (p) {
            var _this = this;
            var drawGrid = function (grid) {
                var offset = grid._getOffset();
                var dotSize = grid._getDotSize();
                p.push();
                p.translate(50, 50);
                grid._dots.forEach(function (row, y) {
                    row.forEach(function (dot, x) {
                        p.fill(p.color(_this._getCSSColor(dot)));
                        p.circle(x * offset, y * offset, dotSize);
                    });
                });
                p.pop();
            };
            p.setup = function () {
                // TODO canvas size is a bit arbitrary
                p.createCanvas(652, 652);
                // Don't draw outlines around circles
                p.noStroke();
                if (this._config.create) {
                    this._config.create(this, this._grid);
                }
            }.bind(this);
            p.draw = function () {
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
            p.keyPressed = function () {
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
            p.mouseClicked = function () {
                if (!this._config.onDotClicked) {
                    return;
                }
                var offset = this._grid._getOffset();
                var dotSize = this._grid._getDotSize();
                // Iterate over all dot locations, and check whether the distance
                // between the click and the dot centre is less than the dot's
                // radius
                for (var y = 0; y < 24; y++) {
                    for (var x = 0; x < 24; x++) {
                        var dx = 50 + x * offset;
                        var dy = 50 + y * offset;
                        // p.mouseX and p.mouseY give is the coordinates in the canvas
                        // space.
                        var distance = p.dist(dx, dy, p.mouseX, p.mouseY);
                        if (distance < dotSize / 2) {
                            this._config.onDotClicked(x, y);
                            // We've found the dot, so exit early
                            return;
                        }
                    }
                }
            }.bind(this);
        }.bind(this));
    };
    Game.prototype._getCSSColor = function (color) {
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
    };
    return Game;
}());
