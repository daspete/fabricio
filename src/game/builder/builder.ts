import { Vector2, Raycaster, Vector3 } from 'three';
import { BaseGame } from '../base.game';
import { BuilderIndicator } from './builder.indicator';
import { BaseTower } from '../towers/base.tower';
import { Positions } from '../utils/positions';
import { Base } from '../bases/base';

export enum BuildMode {
  Tower,
  Base,
  WoodHut,
  StoneHut,
  IronHut,
}

export class Builder {
  game: BaseGame;
  indicator: BuilderIndicator;
  raycaster?: Raycaster;
  pointer: Vector2 = new Vector2(0, 0);
  currentGridPosition: Vector2 = new Vector2(-1, -1);
  towers: BaseTower[] = [];

  constructor(game: BaseGame) {
    this.game = game;
    this.indicator = new BuilderIndicator(this.game);
  }

  async create() {
    this.raycaster = new Raycaster();
    await this.indicator.create();
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
  }

  destroy() {
    window.removeEventListener('pointermove', this.onPointerMove.bind(this));
  }

  onPointerMove(event: PointerEvent) {
    this.pointer.x = (event.clientX / this.game.width) * 2 - 1;
    this.pointer.y = -(event.clientY / this.game.height) * 2 + 1;
  }

  onPointerUp() {
    if (this.currentGridPosition.x < 0 || this.currentGridPosition.y < 0) {
      return;
    }

    if (this.game.pathfinder.isWalkableAt(this.currentGridPosition.x, this.currentGridPosition.y)) {
      this.game.pathfinder.setWalkableAt(this.currentGridPosition.x, this.currentGridPosition.y, false);
      this.addEntity(new Vector2(this.currentGridPosition.x, this.currentGridPosition.y));
      // this.addTower();
    } else {
      const currentTower = this.towers.find((tower) => {
        return Positions.getGridPosition(tower.gameObject!.position, this.game).equals(this.currentGridPosition);
      });

      if (currentTower) {
        this.selectTower(currentTower);
      }
    }
  }

  addEntity(gridPosition: Vector2) {
    switch (this.game.ui.buildMode) {
      case BuildMode.Tower:
        this.addTower(gridPosition);
        break;
      case BuildMode.Base:
        this.addBase(gridPosition);
        break;
      case BuildMode.WoodHut:
        break;
      case BuildMode.StoneHut:
        break;
      case BuildMode.IronHut:
        break;
    }
  }

  async addTower(gridPosition: Vector2) {
    if (this.game.ui.score < 5) {
      return;
    }

    this.game.ui.score -= 5;

    const tower = new BaseTower(this.game);
    await tower.create(gridPosition);
    this.towers.push(tower);
    this.selectTower(tower);
  }

  async addBase(gridPosition: Vector2) {
    const base = new Base(this.game);
    await base.create(gridPosition);
  }

  destroyTower(tower: BaseTower) {
    tower.destroy();

    this.towers = this.towers.filter((t) => t.gameObject?.uuid !== tower.gameObject?.uuid);

    this.game.pathfinder.setWalkableAt(tower.gridPosition.x, tower.gridPosition.y, true);
  }

  selectTower(tower: BaseTower) {
    if (this.game.ui.selectedTower?.gameObject?.uuid === tower.gameObject?.uuid) {
      this.game.ui.selectedTower = undefined;
    } else {
      this.game.ui.selectedTower = tower;
    }
  }

  update() {
    for (const tower of this.towers) {
      tower.update();
    }

    if (this.raycaster && this.game.camera) {
      this.raycaster.setFromCamera(this.pointer, this.game.camera);

      const intersects = this.raycaster.intersectObject(this.game.ground.mesh!);

      if (intersects.length > 0) {
        const point = intersects[0].point;

        const x = Math.floor(point.x / (this.game.ground.width / this.game.ground.cellCountX));
        const z = Math.floor(point.z / (this.game.ground.height / this.game.ground.cellCountY));

        this.currentGridPosition.set(x + this.game.ground.cellCountX * 0.5, z + this.game.ground.cellCountY * 0.5);

        this.indicator.mesh!.position.set(
          (x + 0.5) * (this.game.ground.width / this.game.ground.cellCountX),
          this.indicator.mesh!.position.y,
          (z + 0.5) * (this.game.ground.height / this.game.ground.cellCountY)
        );
      } else {
        this.indicator.mesh!.position.set(-1000, this.indicator.mesh!.position.y, -1000);
        this.currentGridPosition.set(-1, -1);
      }
    }
  }
}
