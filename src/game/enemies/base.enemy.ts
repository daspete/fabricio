import { BoxGeometry, Group, Mesh, MeshPhongMaterial, Vector2, Vector3 } from 'three';
import { BaseGame } from '../base.game';
import { Positions } from '../utils/positions';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';

export enum DieReason {
  EndOfPath,
  Killed,
  NoPath,
}

export class BaseEnemy {
  game: BaseGame;

  // geometry?: BoxGeometry;
  // material?: MeshPhongMaterial;
  // mesh?: Mesh;

  gameObject?: Group;
  model?: Group;

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

  async create(path: Vector3[], endPosition: Vector2) {
    this.endPosition = endPosition;
    this.path = path;

    this.gameObject = new Group();

    this.model = await this.game.modelLoader.load('Tank', '/models/entities/enemies/Tank.glb');
    this.model.scale.set(3,3,3);
    this.model.position.set(0,0,0);

    this.gameObject.position.set(path[0].x, 0, path[0].z);
    this.gameObject.add(this.model);
    this.game.scene.add(this.gameObject);

    this.gameObject.scale.set(0, 0, 0);

    gsap.to(this.gameObject.scale, {
      x: 1,
      y: 1,
      z: 1,      
      duration: 0.15
    });
  }

  updatePath() {
    const path = this.game.pathfinder.findPath(this.currentPathPosition.x, this.currentPathPosition.y, this.endPosition.x, this.endPosition.y);

    if (path === false) {
      this.die(DieReason.NoPath);
      return;
    }

    this.path = path;

    this.currentPathNode = 1;
  }

  die(reason: DieReason) {
    if (this.isDead) {
      return;
    }

    this.isDead = true;

    this.gameObject!.remove(this.gameObject!.children[0]);
    this.game.scene.remove(this.gameObject!);
    this.gameObject = undefined;

    this.game.enemyManager.destroyEnemy(this, reason);
  }

  takeDamage(damage: number) {
    this.energy -= damage;

    if (this.energy <= 0) {
      this.die(DieReason.Killed);
    }
  }

  update() {
    if (!this.gameObject) {
      return;
    }

    if (this.currentPathNode >= this.path.length) {
      this.die(DieReason.EndOfPath);
      return;
    }

    this.currentPathPosition = Positions.getGridPosition(this.gameObject.position, this.game);

    const target = this.path[this.currentPathNode];
    const direction = target.clone().sub(this.gameObject.position).normalize();
    this.gameObject.lookAt(target);
    this.gameObject.position.add(direction.multiplyScalar(this.speed));

    if (this.gameObject.position.distanceTo(target) < this.speed) {
      this.currentPathNode++;
      if (this.currentPathNode >= this.path.length) {
        this.die(DieReason.EndOfPath);
      }
    }
  }
}
