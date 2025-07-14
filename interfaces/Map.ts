import { MapObject } from "./MapObjects";
import { CellType, CellPosition } from "./MapObjects";

export default class Map {
  private _mapObjs: MapObject[][];

  constructor(layout: CellType[][]) {
    this._mapObjs = [];
  
    for (let y = 0; y < layout.length; y++) {
      const row: MapObject[] = [];
  
      for (let x = 0; x < layout[y].length; x++) {
        const type = layout[y][x];
        const position: CellPosition = [x, 0, -y];
        row.push(new MapObject(position, type));
      }
  
      this._mapObjs.push(row);
    }
  }
  
  get mapObjs(): MapObject[][] {
    return this._mapObjs;
  }

  getMapHeight():number { return this._mapObjs.length; }

  getMapWidth(row:number): number { return this._mapObjs[row].length; }

  getMapObject(x: number, y: number): MapObject | undefined { return this._mapObjs[y]?.[x]; }
}
