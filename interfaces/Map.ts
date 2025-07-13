import { MapObjects } from "./MapObjects";

export type CellType = 'empty' | 'wall' | 'playerStart';
export type CellPosition = [number, number, number];

export default class Map {
  private _mapObjs: MapObjects[][];

  constructor(width: number = 10, height: number = 10) {
    this._mapObjs = [];

    for (let y = 0; y < height; y++) {
      const row: MapObjects[] = [];

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
        row.push(new MapObjects(position, type));
      }

      this._mapObjs.push(row);
    }
  }

  get mapObjs(): MapObjects[][] {
    return this._mapObjs;
  }

  getMapObject(x: number, y: number): MapObjects | undefined {
    return this._mapObjs[y]?.[x];
  }
}
