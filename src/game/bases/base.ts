import { Group, Vector2, Vector3 } from 'three';
import type { BaseGame } from '../base.game';
import { Positions } from '../utils/positions';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Base {
  game: BaseGame;

  gridPosition: Vector2 = new Vector2();
  worldPosition: Vector3 = new Vector3();

  gameObject?: Group;
  model?: Group;

  constructor(game: BaseGame) {
    this.game = game;
  }

  async create(gridPosition: Vector2) {
    this.gridPosition = gridPosition;
    this.worldPosition = Positions.getWorldPosition(gridPosition, this.game);

    this.gameObject = new Group();

    this.model = await this.game.modelLoader.load('Base', '/models/entities/base/Base.glb');
    this.model.scale.set(2,2,2);
    this.model.position.set(0,0,-4);

    this.gameObject.position.set(this.worldPosition.x, 0, this.worldPosition.z);
    this.gameObject.add(this.model);

    this.game.scene.add(this.gameObject);
  }
}
