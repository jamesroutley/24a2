"use strict";
/**
 * Color is a set of constants which you can use to set the color of dots.
 *
 * Use it from both TypeScript and JavaScript with:
 *
 * ```javascript
 * game.setDot(x, y, Color.Red)
 * ```
 */
var Color;
(function (Color) {
    Color["Gray"] = "GRAY";
    Color["Black"] = "BLACK";
    Color["Red"] = "RED";
    Color["Orange"] = "ORANGE";
    Color["Yellow"] = "YELLOW";
    Color["Green"] = "GREEN";
    Color["Blue"] = "BLUE";
    Color["Indigo"] = "INDIGO";
    Color["Violet"] = "VIOLET";
})(Color || (Color = {}));
var Direction;
(function (Direction) {
    Direction["Left"] = "LEFT";
    Direction["Right"] = "RIGHT";
    Direction["Up"] = "UP";
    Direction["Down"] = "DOWN";
})(Direction || (Direction = {}));
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
        this._text = "";
        this._ended = false;
        this._frameCount = 0;
        // Variables used when rendering the grid
        this._dotSize = 16;
        this._gapSize = 8;
        this._gridHeight = 24;
        this._gridWidth = 24;
        this._config = config;
        if (config._gridHeight && config._gridHeight > 0) {
            this._gridHeight = config._gridHeight;
        }
        if (config._gridWidth && config._gridWidth > 0) {
            this._gridWidth = config._gridWidth;
        }
        this._dots = new Array(this._gridHeight || 24);
        for (var y = 0; y < this._dots.length; y++) {
            var row = new Array(this._gridWidth || 24);
            for (var i = 0; i < row.length; i++) {
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
    Game.prototype.setText = function (text) {
        this._text = text;
    };
    /**
     * Returns the number of frames that have passed since the game started. The
     * speed at which this increases is dependent on the frame rate. The higher
     * the frame rate is, the faster this number will increment, and vice versa.
     * You can set the frame rate with {@Link GameConfig.frameRate}.
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
     * Returns the color of a dot.
     */
    Game.prototype.getDot = function (x, y) {
        if (y < 0 || y >= this._dots.length) {
            throw new Error("Error trying to get dot (" + x + ", " + y + "): y is out of bounds");
        }
        if (x < 0 || x >= this._dots[y].length) {
            throw new Error("Error trying to get dot (" + x + ", " + y + "): x is out of bounds");
        }
        return this._dots[y][x];
    };
    /**
     * Sets the color of a dot.
     */
    Game.prototype.setDot = function (x, y, val) {
        if (y < 0 || y >= this._dots.length) {
            throw new Error("Error trying to set dot (" + x + ", " + y + "): y is out of bounds");
        }
        if (x < 0 || x >= this._dots[y].length) {
            throw new Error("Error trying to set dot (" + x + ", " + y + "): x is out of bounds");
        }
        this._dots[y][x] = val;
    };
    /**
     * Calling `run` starts the game.
     */
    Game.prototype.run = function () {
        // TODO: there's probably a nicer way of expressing this
        var parentElement = undefined;
        if (this._config.containerId) {
            parentElement =
                document.getElementById(this._config.containerId) || undefined;
        }
        new p5(function (p) {
            p.setup = function () {
                var width = this._dotSize * this._gridWidth +
                    this._gapSize * (this._gridWidth - 1);
                var height = this._dotSize * this._gridHeight +
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
            p.draw = function () {
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
                var textY = this._dotSize * this._gridHeight +
                    this._gapSize * (this._gridHeight - 1) +
                    32;
                p.text(this._text, 0, textY);
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
                var offset = this._dotSize + this._gapSize;
                // Iterate over all dot locations, and check whether the distance
                // between the click and the dot centre is less than the dot's
                // radius
                for (var y = 0; y < this._dots.length; y++) {
                    var row = this._dots[y];
                    for (var x = 0; x < row.length; x++) {
                        var dx = this._dotSize / 2 + x * offset;
                        var dy = this._dotSize / 2 + y * offset;
                        // p.mouseX and p.mouseY give is the coordinates in the canvas
                        // space.
                        var distance = p.dist(dx, dy, p.mouseX, p.mouseY);
                        if (distance < this._dotSize / 2) {
                            this._config.onDotClicked(x, y);
                            // We've found the dot, so exit early
                            return;
                        }
                    }
                }
            }.bind(this);
        }.bind(this), parentElement);
    };
    Game.prototype._drawGrid = function (p) {
        var _this = this;
        var offset = this._dotSize + this._gapSize;
        p.push();
        p.translate(this._dotSize / 2, this._dotSize / 2);
        this._dots.forEach(function (row, y) {
            row.forEach(function (dot, x) {
                p.fill(p.color(_this._getCSSColor(dot)));
                p.circle(x * offset, y * offset, _this._dotSize);
            });
        });
        p.pop();
    };
    Game.prototype._clearGrid = function () {
        var _this = this;
        this._dots.forEach(function (row, y) {
            for (var x = 0; x < row.length; x++) {
                _this.setDot(x, y, Color.Gray);
            }
        });
    };
    Game.prototype._getCSSColor = function (color) {
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
                console.error("no CSS color defined for " + color);
                return "";
        }
    };
    return Game;
}());
