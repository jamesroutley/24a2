"use strict";
var playerX = 11;
var playerY = 20; // const because the player doesn't move in Y axis
var treeRows = new Array(24);
function create(game, grid) {
    // Initialise trees
    for (var y = 23; y >= 0; y--) {
        treeRows[y] = {
            x: 7,
            gap: 10
        };
    }
}
function update(game, grid) {
    game.setText("Distance: " + game.getFrameCount());
    grid.clear();
    treeRows.unshift(getNextTreeRow(treeRows[0]));
    treeRows.pop();
    drawTrees(grid);
    if (grid.getDot(playerX, playerY) === Color.Green) {
        // Player has hit a tree, end game
        grid.setDot(playerX, playerY, Color.Red);
        game.end();
        return;
    }
    // Draw player
    grid.setDot(playerX, playerY, Color.Black);
}
function drawTrees(grid) {
    treeRows.forEach(function (row, y) {
        // Draw the left hand side of this row
        for (var x = 0; x < row.x; x++) {
            grid.setDot(x, y, Color.Green);
        }
        // Draw the right hand side of this row
        for (var x = row.x + row.gap; x < 24; x++) {
            grid.setDot(x, y, Color.Green);
        }
    });
}
// This function defines the difficulty of the game. It would be nice if it got
// progressively harder based on the current frameCount
function getNextTreeRow(currentRow) {
    if (Math.random() < 0.5) {
        // 50% chance of randomisng the gap size
        var gapRandom = Math.floor(Math.random() * 3);
        var oldGap = currentRow.gap;
        var newGap = void 0;
        switch (gapRandom) {
            case 0:
                newGap = oldGap - 1;
                break;
            case 1:
                newGap = oldGap;
                break;
            default:
                newGap = oldGap + 1;
                break;
        }
        if (newGap < 3 || newGap > 9) {
            return currentRow;
        }
        return {
            x: currentRow.x,
            gap: newGap
        };
    }
    // Else, randomize x
    var xRandom = Math.floor(Math.random() * 3);
    var oldX = currentRow.x;
    var newX;
    switch (xRandom) {
        case 0:
            newX = oldX - 1;
            break;
        case 1:
            newX = oldX;
            break;
        default:
            newX = oldX + 1;
            break;
    }
    // There must be at least one tree on each side of the track
    if (newX < 1 || newX + currentRow.gap >= 22) {
        return currentRow;
    }
    return {
        x: newX,
        gap: currentRow.gap
    };
}
function onKeyPress(direction) {
    switch (direction) {
        case Direction.Left:
            if (playerX === 0) {
                return;
            }
            playerX--;
            break;
        case Direction.Right:
            if (playerX === 23) {
                return;
            }
            playerX++;
            break;
    }
}
var config = {
    create: create,
    update: update,
    onKeyPress: onKeyPress
};
var game = new Game(config);
game.run();
