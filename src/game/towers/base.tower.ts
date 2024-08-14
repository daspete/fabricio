import { Color, CylinderGeometry, Mesh, MeshPhongMaterial, Vector3 } from 'three';
import { BaseGame } from '../base.game';
import { BaseWeapon } from '../weapons/base.weapon';
import gsap from 'gsap';

export class BaseTower {
  game: BaseGame;

  geometry?: CylinderGeometry;
  material?: MeshPhongMaterial;
  mesh?: Mesh;

  weapon?: BaseWeapon;

  level: number = 1;

  buildCost: number = 5;
  color: Color = new Color(0x00ff00);
  selectedColor: Color = new Color(0x99ff00);


  constructor(game: BaseGame) {
    this.game = game;
  }

  create(position: Vector3) {
    const scaleX = (this.game.ground.width / this.game.ground.cellCountX) * 0.5;
    const scaleZ = (this.game.ground.height / this.game.ground.cellCountY) * 0.5;

    this.geometry = new CylinderGeometry(scaleX, scaleX, scaleZ * 2);
    this.material = new MeshPhongMaterial({ color: 0x00ff00, flatShading: true });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.x = position.x;
    this.mesh.position.z = position.z;
    this.mesh.position.y = scaleX;
    this.game.scene.add(this.mesh);

    this.weapon = new BaseWeapon(this);

    this.game.enemyManager.updateEnemyPathes();

    this.mesh.scale.set(0, 0, 0);

    gsap.to(this.mesh.scale, {
      x: 1,
      y: 1,
      z: 1,      
      duration: 0.3
    });
  }

  update() {
    this.weapon?.update();

    if(this.game.ui.selectedTower?.mesh?.uuid === this.mesh?.uuid) {
      this.material?.color.copy(this.selectedColor);
    } else {
      this.material?.color.copy(this.color);
    }

    // if(this.material) {
    //   this.material.needsUpdate = true;
    // }
    
  }

  upgrade() {
    if(this.game.ui.score < this.buildCost) {
      return;
    }

    this.game.ui.score -= this.buildCost;

    this.level++;
    this.buildCost += 5;
    this.weapon?.upgrade();
  }

  destroy() {
    this.game.scene.remove(this.weapon!.mesh!);
    this.game.scene.remove(this.mesh!);

    this.mesh?.geometry.dispose();

    this.game.enemyManager.updateEnemyPathes();
  }
}
