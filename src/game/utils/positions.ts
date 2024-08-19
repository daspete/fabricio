import { Vector2, Vector3 } from 'three';
import { BaseGame } from '../base.game';

export class Positions {
  static getGridPosition(position: Vector3, game: BaseGame): Vector2 {
    const x = Math.floor(position.x / (game.ground.width / game.ground.cellCountX));
    const z = Math.floor(position.z / (game.ground.height / game.ground.cellCountY));

    return new Vector2(x + game.ground.cellCountX * 0.5, z + game.ground.cellCountY * 0.5);
  }

  static getWorldPosition(gridPosition: Vector2, game: BaseGame): Vector3 {
    const scaleX = game.ground.width / game.ground.cellCountX;
    const scaleZ = game.ground.height / game.ground.cellCountY;

    const x = (gridPosition.x - game.ground.cellCountX * 0.5) * scaleX;
    const z = (gridPosition.y - game.ground.cellCountY * 0.5) * scaleZ;

    return new Vector3(x + scaleX * 0.5, 0, z + scaleZ * 0.5);
  }
}
