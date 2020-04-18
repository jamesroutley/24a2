"use strict";
var dotSize = 16;
var gap = 8;
var offset = dotSize + gap;
var gridSize = 24;
var Color;
(function (Color) {
    Color[Color["Gray"] = 0] = "Gray";
    Color[Color["Black"] = 1] = "Black";
    Color[Color["Red"] = 2] = "Red";
})(Color || (Color = {}));
function getCSSColor(color) {
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
var Grid = /** @class */ (function () {
    function Grid() {
        this.dots = new Array(gridSize);
        for (var y = 0; y < gridSize; y++) {
            var row = new Array(gridSize);
            for (var i = 0; i < row.length; i++) {
                row[i] = Color.Gray;
            }
            this.dots[y] = row;
        }
    }
    Grid.prototype.getDot = function (x, y) {
        return this.dots[y][x];
    };
    Grid.prototype.setDot = function (x, y, val) {
        this.dots[y][x] = val;
    };
    return Grid;
}());
var grid = new Grid();
function drawGrid(g) {
    g.dots.forEach(function (row, y) {
        row.forEach(function (dot, x) {
            fill(color(getCSSColor(dot)));
            circle(x * offset, y * offset, dotSize);
        });
    });
}
function setup() {
    // TODO canvas size is a bit arbitrary
    createCanvas(652, 652);
    // Don't draw outlines around circles
    noStroke();
    init(grid);
}
function draw() {
    translate(50, 50);
    update(grid);
    drawGrid(grid);
}
function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        onLeftKeyPress();
    }
    if (keyCode === RIGHT_ARROW) {
        onRightKeyPress();
    }
    if (keyCode === UP_ARROW) {
        onUpKeyPress();
    }
    if (keyCode === DOWN_ARROW) {
        onDownKeyPress();
    }
}
function endGame() {
    noLoop();
}
