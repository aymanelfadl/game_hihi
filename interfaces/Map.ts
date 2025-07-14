import { MapObject } from "./MapObjects";
import { CellType, CellPosition } from "./MapObjects";

export default class Map {
  private _mapObjs: MapObject[][];

  constructor(width: number = 10, height: number = 10) {
    this._mapObjs = [];

    for (let y = 0; y < height; y++) {
      const row: MapObject[] = [];

      for (let x = 0; x < width; x++) {
        let type: CellType;

        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
          type = 'wall';
        }
        else if (x === Math.floor(width / 2) && y === Math.floor(height / 2)) {
          type = 'playerStart';
        }
        else {
          type = 'empty';
        }
        const position: CellPosition = [x, 0, -y];
        row.push(new MapObject(position, type));
      }

      this._mapObjs.push(row);
    }
  }

  get mapObjs(): MapObject[][] {
    return this._mapObjs;
  }

  getMapObject(x: number, y: number): MapObject | undefined {
    return this._mapObjs[y]?.[x];
  }
}
