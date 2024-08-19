import { BoxGeometry, Euler, Group, Mesh, MeshPhongMaterial, Vector3 } from 'three';
import { BaseGame } from '../base.game';
import { BaseTower } from '../towers/base.tower';
import { BaseEnemy } from '../enemies/base.enemy';
import { BaseBullet } from './bullets/base.bullet';

export class BaseWeapon {
  tower: BaseTower;
  game: BaseGame;

  gameObject?: Group;
  model?: Group;

  // geometry?: BoxGeometry;
  // material?: MeshPhongMaterial;
  // mesh?: Mesh;

  currentEnemy: BaseEnemy | null = null;

  maxDistance: number = 50;

  lastShootTime: number = 0;
  shootInterval: number = 1;

  damage: number = 5;

  bullet?: BaseBullet;

  constructor(tower: BaseTower) {
    this.tower = tower;
    this.game = this.tower.game;

    // const scaleX = this.game.ground.width / this.game.ground.cellCountX;
    // const scaleZ = this.game.ground.height / this.game.ground.cellCountY;

    // this.geometry = new BoxGeometry(scaleX * 0.2, scaleX * 0.2, scaleZ * 1.5);
    // this.material = new MeshPhongMaterial({ color: 0x00ff00, flatShading: true });
    // this.mesh = new Mesh(this.geometry, this.material);
    // this.mesh.position.set(0, scaleX * 0.75, 0);
    // this.tower.gameObject?.add(this.mesh);
  }

  async create() {
    this.model = await this.game.modelLoader.load('LaserWeapon', '/models/entities/weapons/LaserWeapon.glb');
    this.model.scale.set(2.2,1.2,1.2);
    this.model.rotateY(Math.PI * -0.5);
    
    this.gameObject = new Group();
    this.gameObject.add(this.model);
    this.gameObject.position.set(-0.5, 17, 0);

    this.tower.gameObject?.add(this.gameObject);
  }

  destroy() {
    this.gameObject?.remove(this.model!);
    this.gameObject?.parent?.remove(this.gameObject);
  }

  update() {
    const elapsedTime = this.game.clock.getElapsedTime();

    if (this.currentEnemy) {
      if (this.currentEnemy?.gameObject && this.tower.gameObject!.position.distanceTo(this.currentEnemy.gameObject.position) < this.maxDistance) {
        this.tower.gameObject?.lookAt(this.currentEnemy.gameObject.position);
        this.gameObject?.lookAt(new Vector3(this.currentEnemy.gameObject.position.x, 0, this.currentEnemy.gameObject.position.z));

        if (this.lastShootTime + this.shootInterval < elapsedTime) {
          this.lastShootTime = elapsedTime;
          this.shoot();
        }
      } else {
        this.currentEnemy = null;
        // this.tower.gameObject?.rotation.setFromVector3(new Vector3(0, 0, 0));
        this.gameObject?.rotation.setFromVector3(new Vector3(0, 0, 0));
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
      this.model!.getWorldPosition(weaponPosition);

      this.bullet = new BaseBullet(this, this.currentEnemy);
      this.bullet.create(weaponPosition, this.currentEnemy.gameObject!.position.clone());


      // this.currentEnemy.takeDamage(this.damage);
    }
  }

  findEnemy() {
    const enemies = this.game.enemyManager.enemies;
    let minDistance = Infinity;
    let closestEnemy: BaseEnemy | null = null;

    for (const enemy of enemies) {
      if (enemy.gameObject) {
        const distance = this.tower.gameObject?.position.distanceTo(enemy.gameObject.position);

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
