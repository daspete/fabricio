import { BoxGeometry, Mesh, MeshPhongMaterial, Vector3 } from 'three';
import { BaseGame } from '../base.game';
import { BaseTower } from '../towers/base.tower';
import { BaseEnemy } from '../enemies/base.enemy';
import { BaseBullet } from './bullets/base.bullet';

export class BaseWeapon {
  tower: BaseTower;
  game: BaseGame;

  geometry?: BoxGeometry;
  material?: MeshPhongMaterial;
  mesh?: Mesh;

  currentEnemy: BaseEnemy | null = null;

  maxDistance: number = 50;

  lastShootTime: number = 0;
  shootInterval: number = 1;

  damage: number = 5;

  bullet?: BaseBullet;

  constructor(tower: BaseTower) {
    this.tower = tower;
    this.game = this.tower.game;

    const scaleX = this.game.ground.width / this.game.ground.cellCountX;
    const scaleZ = this.game.ground.height / this.game.ground.cellCountY;

    this.geometry = new BoxGeometry(scaleX * 0.2, scaleX * 0.2, scaleZ * 1.5);
    this.material = new MeshPhongMaterial({ color: 0x00ff00, flatShading: true });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(0, scaleX * 0.75, 0);
    this.tower.mesh?.add(this.mesh);
  }

  update() {
    const elapsedTime = this.game.clock.getElapsedTime();

    if (this.currentEnemy) {
      if (this.currentEnemy?.mesh && this.tower.mesh!.position.distanceTo(this.currentEnemy.mesh.position) < this.maxDistance) {
        this.mesh?.lookAt(this.currentEnemy.mesh.position);

        if (this.lastShootTime + this.shootInterval < elapsedTime) {
          this.lastShootTime = elapsedTime;
          this.shoot();
        }
      } else {
        this.currentEnemy = null;
      }
    } else {
      this.findEnemy();
    }
  }

  upgrade() {
    this.damage += this.tower.level * 2.5;
    this.damage = Math.min(this.damage, 150);

    this.shootInterval -= this.tower.level * 0.05;
    this.shootInterval = Math.max(this.shootInterval, 0.1);

    this.maxDistance += this.tower.level * 2;
    this.maxDistance = Math.min(this.maxDistance, 100);
  }

  shoot() {
    if (this.currentEnemy) {
      let weaponPosition = new Vector3();
      this.mesh!.getWorldPosition(weaponPosition);

      this.bullet = new BaseBullet(this, this.currentEnemy);
      this.bullet.create(weaponPosition, this.currentEnemy.mesh!.position.clone());


      // this.currentEnemy.takeDamage(this.damage);
    }
  }

  findEnemy() {
    const enemies = this.game.enemyManager.enemies;
    let minDistance = Infinity;
    let closestEnemy: BaseEnemy | null = null;

    for (const enemy of enemies) {
      if (enemy.mesh) {
        const distance = this.tower.mesh?.position.distanceTo(enemy.mesh.position);

        if (distance && distance > this.maxDistance) {
          continue;
        }

        if (distance && distance < minDistance) {
          minDistance = distance;
          closestEnemy = enemy;
        }
      }
    }

    if (closestEnemy) {
      this.currentEnemy = closestEnemy;
    }
  }
}
