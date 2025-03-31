export interface Tile{
  isMine: boolean;
  isRevealed: boolean;
  adjacentMines: number;
  isFlagged: boolean;
  id: number;
  row: number;
  col: number
}

export interface ChosenTile{
  row: number;
  col: number;
}