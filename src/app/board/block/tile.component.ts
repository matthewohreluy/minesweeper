import { Component, input, InputSignal, output } from '@angular/core';
import { ChosenTile, Tile } from '../board.model';

@Component({
  selector: 'app-tile',
  imports: [],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss'
})
export class TileComponent {
  tile: InputSignal<Tile> = input.required<Tile>();
  select = output<ChosenTile>();
  toFlag = output<ChosenTile>();

  revealTile(row: number, col: number){
    this.select.emit({row,col})
  }

  flagTile(evt: any, row: number, col: number){
    evt.preventDefault()
    console.log(row,col);
    this.toFlag.emit({row,col})
  }
}
