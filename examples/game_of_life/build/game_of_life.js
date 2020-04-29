"use strict";
function update(game, grid) { }
function onDotClicked(x, y) {
    console.log(x, y);
}
var config = {
    update: update,
    onDotClicked: onDotClicked
};
var game = new Game(config);
game.run();
