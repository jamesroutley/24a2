declare let dotSize: number;
declare let gap: number;
declare let offset: number;
declare let gridSize: number;
declare enum Color {
    Gray = 0,
    Black = 1,
    Red = 2
}
declare function init(grid: Grid): void;
declare function update(grid: Grid): void;
declare function onLeftKeyPress(): void;
declare function onRightKeyPress(): void;
declare function onUpKeyPress(): void;
declare function onDownKeyPress(): void;
declare function getCSSColor(color: Color): string;
declare class Grid {
    dots: Array<Array<Color>>;
    constructor();
    getDot(x: number, y: number): Color;
    setDot(x: number, y: number, val: Color): void;
}
declare let grid: Grid;
declare function drawGrid(g: Grid): void;
declare function setup(): void;
declare function draw(): void;
declare function endGame(): void;
declare function setBottomText(message: string): void;
declare function setFrameRate(n: number): void;
