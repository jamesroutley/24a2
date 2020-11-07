/**
 * Color is a set of constants which you can use to set the color of dots.
 *
 * Use it from both TypeScript and JavaScript with:
 *
 * ```javascript
 * game.setDot(x, y, Color.Red)
 * ```
 */
export declare enum Color {
    Gray = "GRAY",
    Black = "BLACK",
    Red = "RED",
    Orange = "ORANGE",
    Yellow = "YELLOW",
    Green = "GREEN",
    Blue = "BLUE",
    Indigo = "INDIGO",
    Violet = "VIOLET"
}
export declare enum Direction {
    Left = "LEFT",
    Right = "RIGHT",
    Up = "UP",
    Down = "DOWN"
}
/**
 * GameConfig is the object you pass when contructing a new {@link Game}.
 */
export interface GameConfig {
    /**
     * `create(game)` is a function which is called once, just before the game
     * starts running. You can use it to initialise game state, if needed.
     */
    create?: (game: Game) => void;
    /**
     * `update(game)` is repeatedly called as the game runs. You can use it to
     * define the main functionality of your game.
     */
    update?: (game: Game) => void;
    /**
     * `onKeyPress(direction)` is a function which is called when the player
     * presses one of the arrow keys.
     */
    onKeyPress?: (direction: Direction) => void;
    /**
     * `onDotClicked(x, y)` is a function which is called when the player clicks
     * on a dot.
     */
    onDotClicked?: (x: number, y: number) => void;
    /**
     * The ID of a container to create the canvas in.
     */
    containerId?: string;
    /**
     * Sets the game's frame rate. By default, this is set to 24.
     */
    frameRate?: number;
    /**
     * Set the default color of the dots. By default, this is set to
     * {@Link Color.Gray}.
     */
    defaultDotColor?: Color;
    /**
     *
     * Sets the width of the grid. By default, this is set to 24.
     */
    gridWidth?: number;
    /**
     *
     * Sets the height of the grid. By default, this is set to 24.
     */
    gridHeight?: number;
    /**
     * @ignore
     */
    _gridWidth?: number;
    /**
     * @ignore
     */
    _gridHeight?: number;
    /**
     * Specifies whether 24a2 should clear the grid at the beginning of each
     * frame. 24a2 clears the grid by setting the colour of every dot to
     * {@Link GameConfig.defaultDotColor}. Setting clearGrid to false lets you
     * simplify the code for some games by letting 24a2 store the state for each
     * dot. You can use {@Link Game.getDot} to read back the colour of dots. By
     * default, this is set to true.
     */
    clearGrid?: boolean;
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
export declare class Game {
    private _config;
    private _text;
    private _ended;
    private _frameCount;
    private _dots;
    private _gridHeight;
    private _gridWidth;
    private _clear;
    private _renderer?;
    private _interval?;
    constructor(config: GameConfig);
    /**
     * 24a2 games have a line of text below the grid which can be set to show
     * information to the player. This is commonly used to show instructions or
     * the player's score. Use this function to set that text.
     */
    setText(text: string): void;
    /**
     * Returns the number of frames that have passed since the game started. The
     * speed at which this increases is dependent on the frame rate. The higher
     * the frame rate is, the faster this number will increment, and vice versa.
     * You can set the frame rate with {@Link GameConfig.frameRate}.
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
     * Returns the color of a dot.
     */
    getDot(x: number, y: number): Color;
    /**
     * Sets the color of a dot.
     */
    setDot(x: number, y: number, val: Color): void;
    /**
     * Calling `run` starts the game.
     */
    run(): void;
    /**
     * The internal function that's called on every frame.
     */
    private _update;
    private _clearGrid;
    private _render;
}
