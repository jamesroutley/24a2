"use strict";
function pointsEqual(a, b) {
    return a.x === b.x && a.y === b.y;
}
var score = 0;
// sectionsToAdd stores the number of dots to add to the snake. We add sections
// when the snake 'eats' a pill, to increase difficulty. As the game progesses,
// we add more and more sections per pill
var sectionsToAdd = 0;
// TODO: ransomise initial direction
// TODO: make this an enum
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
function createPill(grid) {
    var pill = {
        x: Math.floor(Math.random() * 24),
        y: Math.floor(Math.random() * 24)
    };
    // Don't create a pill on the snake
    function pointInSnake(p) {
        // Consider the point one ahead of the snake to be in the snake too
        if (pointsEqual(p, getNextLocation(snake[0], direction))) {
            return true;
        }
        for (var _i = 0, snake_1 = snake; _i < snake_1.length; _i++) {
            var dot = snake_1[_i];
            if (pointsEqual(dot, p)) {
                return true;
            }
        }
        return false;
    }
    while (pointInSnake(pill)) {
        pill = {
            x: Math.floor(Math.random() * 24),
            y: Math.floor(Math.random() * 24)
        };
    }
    console.log("creating pill at (" + pill.x + ", " + pill.y + ")");
    grid.setDot(pill.x, pill.y, Color.Red);
}
function init(grid) {
    // Drop framerate
    setFrameRate(5);
    setSnake(grid);
    createPill(grid);
}
function update(grid) {
    directionChangeThisFrame = false;
    var head = snake[0];
    var nextLocation = getNextLocation(head, direction);
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
        sectionsToAdd += getSectionsForScore(score);
        createPill(grid);
        score++;
    }
    setBottomText("Score: " + score);
    // Push the next location to the front of the snake
    snake.unshift(nextLocation);
    // Clear the back of the snake, if we don't have sections we need to add
    if (sectionsToAdd === 0) {
        var exLocation = snake.pop();
        if (exLocation) {
            grid.setDot(exLocation.x, exLocation.y, 0);
        }
    }
    else {
        sectionsToAdd--;
    }
    setSnake(grid);
}
function getSectionsForScore(score) {
    // N.B: this is quite a steep increase in difficulty
    return score + 1;
}
function getNextLocation(location, direction) {
    var nextLocation = { x: location.x, y: location.y };
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
    return nextLocation;
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
