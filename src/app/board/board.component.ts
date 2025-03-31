import { Component, inject, OnInit, signal } from '@angular/core';
import { TileComponent } from './block/tile.component';
import { BoardService } from './board.service';
import { ChosenTile, Tile } from './board.model';

@Component({
  selector: 'app-board',
  imports: [TileComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
  boardService = inject(BoardService);
  board = this.boardService.tiles;
  isWin = this.boardService.isWin;

  ngOnInit(): void {
    this.boardService.initializeBoard();
    console.log(this.board());
  }

  onRevealTile(chosenTile: ChosenTile){
    this.boardService.floodFill(chosenTile);
  }

  onFlagTile(chosenTile: ChosenTile){
    this.boardService.flagTile(chosenTile);
  }


}
