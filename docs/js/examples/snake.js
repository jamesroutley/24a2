"use strict";
// TODO: ransomise initial direction
var direction = "RIGHT";
// TODO: randomise snake start position
var snake = [
    { x: 7, y: 7 },
    { x: 6, y: 7 }
];
// This fixes a bug where you can turn back on yourself if you quickly type
// two arrow keys before the next time `update` is called
var directionChangeThisFrame = false;
function setSnake(grid) {
    snake.forEach(function (dot) {
        grid.setDot(dot.x, dot.y, 1);
    });
}
// TODO: I think there's a bug where the pill can be created in the spot the
// snake is about to move to
function createPill(grid) {
    var pill = {
        x: Math.floor(random(24)),
        y: Math.floor(random(24))
    };
    // Don't create a pill on the snake
    function pointInSnake(p) {
        snake.forEach(function (dot) {
            if (dot.x === p.x && dot.y === p.y) {
                return true;
            }
        });
        return false;
    }
    while (pointInSnake(pill)) {
        pill = {
            x: Math.floor(random(24)),
            y: Math.floor(random(24))
        };
    }
    grid.setDot(pill.x, pill.y, Color.Red);
}
function init(grid) {
    // Drop framerate
    frameRate(5);
    setSnake(grid);
    createPill(grid);
}
function update(grid) {
    directionChangeThisFrame = false;
    var head = snake[0];
    var nextLocation = { x: head.x, y: head.y };
    if (direction === "RIGHT") {
        nextLocation.x++;
    }
    if (direction === "LEFT") {
        nextLocation.x--;
    }
    if (direction === "UP") {
        nextLocation.y--;
    }
    if (direction === "DOWN") {
        nextLocation.y++;
    }
    // Modulo x and y to wrap around
    if (nextLocation.x > 23) {
        nextLocation.x = 0;
    }
    if (nextLocation.y > 23) {
        nextLocation.y = 0;
    }
    if (nextLocation.x < 0) {
        nextLocation.x = 23;
    }
    if (nextLocation.y < 0) {
        nextLocation.y = 23;
    }
    // If nextLocation is in the snake, end the game
    if (grid.getDot(nextLocation.x, nextLocation.y) === Color.Black) {
        // Color the snake in red
        snake.forEach(function (dot) {
            grid.setDot(dot.x, dot.y, Color.Red);
        });
        endGame();
        return;
    }
    // If nextLocation is a pill, increase snake size
    if (grid.getDot(nextLocation.x, nextLocation.y) === Color.Red) {
        var end = snake.pop();
        if (!end) {
            console.error("zero length snake");
            return;
        }
        snake.push(end);
        snake.push(end);
        createPill(grid);
    }
    snake.unshift(nextLocation);
    var exLocation = snake.pop();
    if (exLocation) {
        grid.setDot(exLocation.x, exLocation.y, 0);
    }
    setSnake(grid);
}
function onLeftKeyPress() {
    if (directionChangeThisFrame) {
        return;
    }
    if (direction === "RIGHT") {
        return;
    }
    direction = "LEFT";
    directionChangeThisFrame = true;
}
function onRightKeyPress() {
    if (directionChangeThisFrame) {
        return;
    }
    if (direction === "LEFT") {
        return;
    }
    direction = "RIGHT";
    directionChangeThisFrame = true;
}
function onUpKeyPress() {
    if (directionChangeThisFrame) {
        return;
    }
    if (direction === "DOWN") {
        return;
    }
    direction = "UP";
    directionChangeThisFrame = true;
}
function onDownKeyPress() {
    if (directionChangeThisFrame) {
        return;
    }
    if (direction === "UP") {
        return;
    }
    direction = "DOWN";
    directionChangeThisFrame = true;
}
