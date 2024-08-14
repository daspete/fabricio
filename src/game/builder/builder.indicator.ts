import { BoxGeometry, Mesh, MeshPhongMaterial } from "three";
import { BaseGame } from "../base.game";

export class BuilderIndicator {
  game: BaseGame;

  geometry?: BoxGeometry;
  material?: MeshPhongMaterial;
  mesh?: Mesh;
  
  constructor(game: BaseGame) {
    this.game = game;
  }

  async create() {
    const scaleX = this.game.ground.width / this.game.ground.cellCountX;
    const scaleZ = this.game.ground.height / this.game.ground.cellCountY;

    this.geometry = new BoxGeometry(scaleX * 1.1, 1, scaleZ * 1.1);
    this.material = new MeshPhongMaterial({ color: 0x99ff00, flatShading: true });
    this.material.transparent = true;
    this.material.opacity = 0.5;
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(scaleX * 0.5, 0, -scaleZ * 0.5);
    this.game.scene.add(this.mesh);
  }
}
