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
declare class Game {
    private _config;
    private _grid;
    private _text;
    private _frameRate;
    private _ended;
    private _frameCount;
    constructor(config: GameConfig);
    setText(text: string): void;
    setFrameRate(rate: number): void;
    getFrameCount(): number;
    end(): void;
    run(): void;
    private _getCSSColor;
}
