export type CellType = 'empty' | 'wall' | 'playerStart' | 'door';
export type CellPosition = [number, number, number];

export class MapObject
{
  private _position: CellPosition;
  private _type: CellType;

  constructor(position: CellPosition, type: CellType) {
    this._position = position;
    this._type = type;
  }

  get position(): CellPosition {
    return this._position;
  }

  set position(position: CellPosition) {
    this._position = position;
  }

  get type(): CellType {
    return this._type;
  }

  set type(type: CellType) {
    this._type = type;
  }
}

