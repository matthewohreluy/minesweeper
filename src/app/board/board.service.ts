import { computed, Injectable, signal, WritableSignal } from "@angular/core";
import { ChosenTile, Tile } from "./board.model";

@Injectable({
  providedIn: 'root'
})
export class BoardService{
  private size: WritableSignal<number> = signal<number>(10);
  private mines: WritableSignal<number> = signal<number>(10);
  private content: WritableSignal<Tile[][]> = signal([]);
  private revealedTiles: WritableSignal<number> = signal<number>(0);
  private totalTiles = computed(()=>Math.pow(this.size(),2));

  isWin: WritableSignal<boolean | null> = signal(null)
  tiles = this.content;

  initializeBoard(){
    this.generateBoard();
    this.countAdjacentTiles();
  }



  revealTile(chosenTile: ChosenTile){
    if(this.isRevealed(chosenTile)) return;
    this.content.update(board => {
      return board.map(row =>
          row.map(t => {
              if (t.row === chosenTile.row && t.col === chosenTile.col) {
                  if (!t.isMine && !t.isRevealed) {
                      this.revealedTiles.update(count => count + 1);
                  }
                  return { ...t, isRevealed: true, isFlagged: false };
              }
              return t;
          })
      );
  });
  console.log(this.revealedTiles())
    this.checkWinCondition(chosenTile);
  }

  flagTile(chosenTile: ChosenTile){
    if(this.isRevealed(chosenTile)) return;
    this.content.update(board=> {
      const newBoard = board.map(row =>
        row.map(t=> t.row === chosenTile.row && t.col === chosenTile.col ? {...t, isFlagged: !this.content()[t.row][t.col].isFlagged} : t)
      );
      return newBoard
    })
  }


  private checkWinCondition(chosenTile: ChosenTile){
    if(this.isRevealed(chosenTile) && this.isMine(chosenTile)){
      //lose logic
      this.isWin.set(false);
      // reveal all
    }else if(this.totalTiles() - this.revealedTiles() === this.mines()){ //all tiles
      //win logic
      this.isWin.set(true);
    }
  }

  private isMine(chosenTile: ChosenTile){
    const rowIndex = chosenTile.row;
    const colIndex = chosenTile.col;
    return this.content()[rowIndex][colIndex].isMine;
  }




  private generateBoard(){
    const boardSize = this.size();
    let index = 0;
    const mineIndexes = new Set(this.populateMines());
    const newBoard = Array.from({ length: boardSize }, (_, row) =>
      Array.from({ length: boardSize }, (_, col) => ({
        id: index++, // Assign a unique ID
        row,
        col,
        isMine: mineIndexes.has(index),
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0
      }))
    );
    this.content.set(newBoard);

  }

  private populateMines(){
    const mineCount = this.mines();
    const totalTiles = Math.pow(this.size(), 2);
    const mineIndexes = new Set<number>();

    while (mineIndexes.size < mineCount) {
      mineIndexes.add(Math.floor(Math.random() * totalTiles));
    }

    return Array.from(mineIndexes).sort((a, b) => a - b);
  }

  private countAdjacentTiles() {
    const boardSize = this.content().length;
    const board = this.content(); // Get the current board state
    // Iterate through each tile
    for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
      for (let colIndex = 0; colIndex < boardSize; colIndex++) {
        if (board[rowIndex][colIndex].isMine) {
          // Check all adjacent tiles
          for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
            for (let j = colIndex - 1; j <= colIndex + 1; j++) {
              if (
                i >= 0 && i < boardSize && // Row is in bounds
                j >= 0 && j < boardSize && // Column is in bounds
                !(i === rowIndex && j === colIndex) // Skip the mine itself
              ) {
                board[i][j].adjacentMines += 1; // Increase adjacent mine count
              }
            }
          }
        }
      }
    }

    // Now update the entire board once
    this.content.set([...board]);
  }

  floodFill(chosenTile: ChosenTile){
    const boardSize = this.content().length;
    const row = chosenTile.row;
    const col = chosenTile.col;
    // check if tile is fillable => fillable if adjacentMine && within bounds
    if(
      row >= 0 && row < boardSize && // Row is in bounds
      col >= 0 && col < boardSize && // Column is in bounds
      this.content()[row][col].isRevealed !== true
     ){
      this.revealTile(chosenTile);
      if(this.content()[row][col].adjacentMines === 0){
        this.floodFill({row: chosenTile.row + 1, col: chosenTile.col});
        this.floodFill({row: chosenTile.row - 1, col: chosenTile.col});
        this.floodFill({row: chosenTile.row, col: chosenTile.col + 1});
        this.floodFill({row: chosenTile.row, col: chosenTile.col - 1});
      }else{
        return;
      }
     }else{
      return;
     }
  }

  private isRevealed(chosenTile: ChosenTile){
    const rowIndex = chosenTile.row;
    const colIndex = chosenTile.col;
    return this.content()[rowIndex][colIndex].isRevealed;
  }
}