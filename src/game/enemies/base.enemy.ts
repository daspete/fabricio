import { BoxGeometry, Mesh, MeshPhongMaterial, Vector2, Vector3 } from 'three';
import { BaseGame } from '../base.game';
import { Positions } from '../utils/positions';

export enum DieReason {
  EndOfPath,
  Killed,
  NoPath
}

export class BaseEnemy {
  game: BaseGame;

  geometry?: BoxGeometry;
  material?: MeshPhongMaterial;
  mesh?: Mesh;

  currentPathNode: number = 1;
  currentPathPosition: Vector2 = new Vector2();

  path: Vector3[] = [];
  endPosition: Vector2 = new Vector2();

  energy: number = 10;
  speed: number = 0.01;

  level: number = 1;

  isDead: boolean = false;

  constructor(game: BaseGame, energy: number, speedRange: number, level: number) {
    this.energy = energy;
    this.level = level;
    this.speed = Math.random() * speedRange + 0.4;
    this.game = game;
  }

  create(path: Vector3[], endPosition: Vector2) {
    this.endPosition = endPosition;
    this.path = path;
    const scaleX = this.game.ground.width / this.game.ground.cellCountX;
    const scaleZ = this.game.ground.height / this.game.ground.cellCountY;

    this.geometry = new BoxGeometry(scaleX, scaleX, scaleZ);
    this.material = new MeshPhongMaterial({ color: 0xff0000, flatShading: true });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.copy(path[0]);
    this.game.scene.add(this.mesh);
  }

  updatePath() {
    const path = this.game.pathfinder.findPath(
      this.currentPathPosition.x,
      this.currentPathPosition.y,
      this.endPosition.x,
      this.endPosition.y
    );

    if (path === false) {
      this.die(DieReason.NoPath);
      return;
    }

    this.path = path;

    this.currentPathNode = 1;
  }

  die(reason: DieReason) {
    if(this.isDead) {
      return;
    }
    
    this.isDead = true;

    this.game.scene.remove(this.mesh!);
    this.mesh = undefined;

    this.game.enemyManager.destroyEnemy(this, reason);
  }

  takeDamage(damage: number) {
    this.energy -= damage;

    if (this.energy <= 0) {
      this.die(DieReason.Killed);
    }
  }

  update() {
    if (!this.mesh) {
      return;
    }

    if (this.currentPathNode >= this.path.length) {
      this.die(DieReason.EndOfPath);
      return;
    }

    this.currentPathPosition = Positions.getGridPosition(this.mesh.position, this.game);
    
    const target = this.path[this.currentPathNode];
    const direction = target.clone().sub(this.mesh.position).normalize();
    this.mesh.lookAt(target);
    this.mesh.position.add(direction.multiplyScalar(this.speed));

    if (this.mesh.position.distanceTo(target) < this.speed) {
      this.currentPathNode++;
      if (this.currentPathNode >= this.path.length) {
        this.die(DieReason.EndOfPath);
      }
    }
  }
}
