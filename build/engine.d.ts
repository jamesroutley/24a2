declare enum Color {
    Gray = "GRAY",
    Black = "BLACK",
    Red = "RED",
    Green = "GREEN",
    Yellow = "YELLOW"
}
declare enum Direction {
    Left = "LEFT",
    Right = "RIGHT",
    Up = "UP",
    Down = "DOWN"
}
declare class Grid {
    private _dotSize;
    private _gap;
    private _gridSize;
    _dots: Array<Array<Color>>;
    constructor();
    _getDotSize(): number;
    _getOffset(): number;
    _getGridSize(): number;
    getDot(x: number, y: number): Color;
    setDot(x: number, y: number, val: Color): void;
    _clear(): void;
}
/**
 * GameConfig is the object you pass when contructing a new {@link Game}.
 */
interface GameConfig {
    /**
     * `create` is a function which is called once, just before the game starts
     * running. You can use it to initialise game state, if needed.
     */
    create?: (game: Game, grid: Grid) => void;
    /**
     * `update` is repeatedly called as the game runs. You can use it to define
     * the main functionality of your game.
     */
    update?: (game: Game, grid: Grid) => void;
    /**
     * `onKeyPress` is a function which is called when the player presses one of
     * the arrow keys.
     */
    onKeyPress?: (direction: Direction) => void;
    /**
     * `onDotClicked` is a function which is called when the player clicks on a
     * dot.
     */
    onDotClicked?: (x: number, y: number) => void;
}
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
declare class Game {
    private _config;
    private _grid;
    private _text;
    private _frameRate;
    private _ended;
    private _frameCount;
    constructor(config: GameConfig);
    /**
     * 24a2 games have a line of text below the grid which can be set to show
     * information to the player. This is commonly used to show instructions or
     * the player's score. Use this function to set that text.
     */
    setText(text: string): void;
    /**
     * Sets the frame rate of the game. This is set to 24 by default. The frame
     * rate defines how frequently the `update` function is called - by default
     * it's called 24 times per second.
     */
    setFrameRate(rate: number): void;
    /**
     * Returns the number of frames that have passed since the game started. The
     * speed at which this increases is dependent on the frame rate. The higher
     * the frame rate is, the faster this number will increment, and vice versa.
     * You can set the frame rate with {@Link Game.setFrameRate}.
     *
     * You can use this function to do things like increase difficulty as time
     * goes on.
     */
    getFrameCount(): number;
    /**
     * Calling `end` stops the game loop. You should call it when the game is
     * finished. After you call it, the game is rendered one final time. Because
     * of this, you often want to `return` just after you call `game.end()` to
     * make sure any code after it is executed.
     */
    end(): void;
    /**
     * Calling `run` starts the game.
     */
    run(): void;
    private _getCSSColor;
}
