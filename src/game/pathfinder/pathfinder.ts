import { AStarFinder, Grid } from 'pathfinding';
import type { BaseGame } from '../base.game';
import { Vector3 } from 'three';

export class Pathfinder {
  game: BaseGame;

  grid?: Grid;
  pathfinder?: AStarFinder;

  constructor(game: BaseGame) {
    this.game = game;
  }

  async create() {
    this.grid = new Grid(this.game.ground.cellCountX, this.game.ground.cellCountY);
    this.pathfinder = new AStarFinder({
      // @ts-ignore
      allowDiagonal: true,
      dontCrossCorners: true,
    });
  }

  setWalkableAt(x: number, y: number, walkable: boolean) {
    this.grid?.setWalkableAt(x, y, walkable);
  }

  isWalkableAt(x: number, y: number) {
    return this.grid?.isWalkableAt(x, y);
  }

  findPath(startX: number, startY: number, endX: number, endY: number) {
    const path = this.pathfinder?.findPath(startX, startY, endX, endY, this.grid!.clone());
    if (!path || path.length === 0) {
      return false;
    }
    return path.map((point) => {
      let x = point[0] - this.game.ground.cellCountX * 0.5;
      let z = point[1] - this.game.ground.cellCountY * 0.5;

      x = (x + 0.5) * (this.game.ground.width / this.game.ground.cellCountX);
      z = (z + 0.5) * (this.game.ground.height / this.game.ground.cellCountY);
      return new Vector3(x, 10, z);
    });
  }
}
