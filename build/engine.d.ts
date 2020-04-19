declare enum Color {
    Gray = "GRAY",
    Black = "BLACK",
    Red = "RED"
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
}
interface GameConfig {
    create: (game: Game, grid: Grid) => void;
    update: (game: Game, grid: Grid) => void;
    onKeyPress: (direction: Direction) => void;
}
declare class Game {
    private _config;
    private _grid;
    private _text;
    private _frameRate;
    private _ended;
    constructor(config: GameConfig);
    setText(text: string): void;
    setFrameRate(rate: number): void;
    end(): void;
    run(): void;
    _getCSSColor(color: Color): string;
}
