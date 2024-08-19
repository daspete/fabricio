import { Color, CylinderGeometry, Group, Mesh, MeshPhongMaterial, Vector2, Vector3 } from 'three';
import { BaseGame } from '../base.game';
import { BaseWeapon } from '../weapons/base.weapon';
import gsap from 'gsap';
import { Positions } from '../utils/positions';

export class BaseTower {
  game: BaseGame;

  // geometry?: CylinderGeometry;
  // material?: MeshPhongMaterial;
  // mesh?: Mesh;
  gameObject?: Group;
  model?: Group;

  weapon?: BaseWeapon;

  level: number = 1;

  buildCost: number = 5;
  color: Color = new Color(0x00ff00);
  selectedColor: Color = new Color(0x99ff00);

  gridPosition: Vector2 = new Vector2();
  worldPosition: Vector3 = new Vector3();


  constructor(game: BaseGame) {
    this.game = game;
  }

  async create(gridPosition: Vector2) {
    this.gridPosition = gridPosition;
    this.worldPosition = Positions.getWorldPosition(gridPosition, this.game);

    this.gameObject = new Group();

    this.model = await this.game.modelLoader.load('BaseTower', '/models/entities/towers/BaseTower.glb');
    this.model.scale.set(4,4,4);
    this.model.position.set(0,0,0);
    this.model.rotateY(Math.PI * 0.5);

    this.gameObject.position.set(this.worldPosition.x, 0, this.worldPosition.z);
    this.gameObject.add(this.model);

    this.game.scene.add(this.gameObject);

    // const scaleX = (this.game.ground.width / this.game.ground.cellCountX) * 0.5;
    // const scaleZ = (this.game.ground.height / this.game.ground.cellCountY) * 0.5;

    // this.geometry = new CylinderGeometry(scaleX, scaleX, scaleZ * 2);
    // this.material = new MeshPhongMaterial({ color: 0x00ff00, flatShading: true });
    // this.mesh = new Mesh(this.geometry, this.material);
    // this.mesh.position.x = this.worldPosition.x;
    // this.mesh.position.z = this.worldPosition.z;
    // this.mesh.position.y = scaleX;
    // this.game.scene.add(this.mesh);

    this.weapon = new BaseWeapon(this);
    await this.weapon.create();

    this.game.enemyManager.updateEnemyPathes();

    this.gameObject.scale.set(0, 0, 0);

    gsap.to(this.gameObject.scale, {
      x: 1,
      y: 1,
      z: 1,      
      duration: 0.3
    });
  }

  update() {
    this.weapon?.update();

    if(this.game.ui.selectedTower?.gameObject?.uuid === this.gameObject?.uuid) {
      // this.material?.color.copy(this.selectedColor);
    } else {
      // this.material?.color.copy(this.color);
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
    this.weapon?.destroy();
    this.gameObject?.remove(this.gameObject.children[0]);
    this.game.scene.remove(this.gameObject!);

    this.game.enemyManager.updateEnemyPathes();
  }
}
