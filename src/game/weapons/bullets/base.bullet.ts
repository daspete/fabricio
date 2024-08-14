import gsap from "gsap";
import { BufferGeometry, Line, LineBasicMaterial, Mesh, MeshPhongMaterial, PointLight, SphereGeometry, Vector3 } from "three";
import type { BaseGame } from "~/game/base.game";
import type { BaseEnemy } from "~/game/enemies/base.enemy";
import type { BaseWeapon } from "../base.weapon";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class BaseBullet {
  weapon: BaseWeapon;
  game: BaseGame;
  enemy: BaseEnemy;

  geometry?: SphereGeometry;
  material?: MeshPhongMaterial;
  mesh?: Mesh;
  light?: PointLight;

  lineGeometry?: BufferGeometry;
  lineMaterial?: LineBasicMaterial;
  lineMesh?: Line;

  constructor(weapon: BaseWeapon, enemy: BaseEnemy) {
    this.weapon = weapon;
    this.game = this.weapon.game;
    this.enemy = enemy;
  }

  async create(startPosition: Vector3, targetPosition: Vector3) {
    console.log('BaseBullet.create', startPosition, targetPosition);

    const scale = 0.5;
    this.lineGeometry = new BufferGeometry().setFromPoints([startPosition, targetPosition]);
    this.lineMaterial = new LineBasicMaterial({ color: 0xff0000 });
    this.lineMaterial.linewidth = 10;

    this.lineMesh = new Line(this.lineGeometry, this.lineMaterial);

    this.game.scene.add(this.lineMesh);

    await sleep(100);

    this.game.scene.remove(this.light!);
    this.game.scene.remove(this.lineMesh!);

    if(this.enemy && !this.enemy.isDead) {
      this.enemy.takeDamage(this.weapon.damage);
    }
  }
}
