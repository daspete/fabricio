import { BoxGeometry, Mesh, MeshPhongMaterial, RepeatWrapping, Texture } from 'three';
import type { BaseGame } from '../base.game';

export class Ground {
  game: BaseGame;

  width: number = 800;
  height: number = 200;

  cellCountX: number = 40;
  cellCountY: number = 10;

  geometry?: BoxGeometry;
  material?: MeshPhongMaterial;
  texture?: Texture;
  mesh?: Mesh;

  constructor(game: BaseGame) {
    this.game = game;
  }

  async create() {
    this.geometry = new BoxGeometry(this.width, 1, this.height);

    this.texture = await this.game.loader.load('ground', '/assets/environment/ground.png');
    this.texture.wrapS = RepeatWrapping;
    this.texture.wrapT = RepeatWrapping;
    this.texture.repeat.set(this.cellCountX * 0.5, this.cellCountY * 0.5);

    this.material = new MeshPhongMaterial({ flatShading: true, map: this.texture });

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(0, -0.5, 0);

    this.game.scene.add(this.mesh);
  }
}
