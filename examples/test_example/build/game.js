"use strict";
var movedThisFrame = false;
var player = { x: 12, y: 12 };
var danger = { x: 10, y: 10 };
function create(game) {
    console.log("create called");
}
function update(game) {
    game.setDot(danger.x, danger.y, Color.Yellow);
    if (movedThisFrame) {
        var previousColour = game.getDot(player.x, player.y);
        console.log("Player at (" + player.x + ", " + player.y + ", previous colour: " + previousColour + ")");
        movedThisFrame = false;
    }
    if (player.x == danger.x && player.y == danger.y) {
        game.setDot(player.x, player.y, Color.Red);
        game.setText("Game over");
        game.end();
        return;
    }
    game.setText("Frame: " + game.getFrameCount());
    game.setDot(player.x, player.y, Color.Black);
}
function onKeyPress(direction) {
    movedThisFrame = true;
    switch (direction) {
        case Direction.Left:
            player.x--;
            return;
        case Direction.Right:
            player.x++;
            return;
        case Direction.Up:
            player.y--;
            return;
        case Direction.Down:
            player.y++;
            return;
    }
}
function onDotClicked(x, y) {
    console.log("Dot (" + x + ", " + y + ") clicked");
}
var config = {
    create: create,
    update: update,
    onKeyPress: onKeyPress,
    onDotClicked: onDotClicked,
    clearGrid: false,
};
var game = new Game(config);
game.run();
