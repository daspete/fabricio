import { Clock, Vector3, WebGLRenderer } from 'three';
import { GameScene } from './scenes/game.scene';
import { BaseCamera } from './cameras/base.camera';
import { Ground } from './environment/ground';
import { ImageLoader } from './loaders/image.loader';
import { Builder } from './builder/builder';
import { Pathfinder } from './pathfinder/pathfinder';
import { EnemyManager } from './enemies/enemy.manager';
import type { BaseTower } from './towers/base.tower';

export type GameUi = {
  level: number;
  score: number;
  selectedTower?: BaseTower;
}

export class BaseGame {
  container: HTMLElement;
  width: number;
  height: number;
  renderer: WebGLRenderer;
  scene: GameScene;
  camera: BaseCamera;
  ground: Ground;
  loader: ImageLoader;
  builder: Builder;
  pathfinder: Pathfinder;
  enemyManager: EnemyManager;
  clock: Clock;

  level: number = 0;

  ui: GameUi;

  constructor(container: HTMLElement, ui: GameUi) {
    this.loader = new ImageLoader();
    this.ui = ui;

    this.container = container;

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new GameScene(this);
    this.camera = new BaseCamera(this, 60, this.width / this.height, 0.1, 1000, new Vector3(0, 150, -150));

    this.ground = new Ground(this);
    this.builder = new Builder(this);
    this.pathfinder = new Pathfinder(this);
    this.enemyManager = new EnemyManager(this);
    this.clock = new Clock();

    window.addEventListener('resize', this.resize.bind(this));

    this.start();
  }

  async start() {
    await this.ground.create();
    await this.builder.create();
    await this.pathfinder.create();

    this.enemyManager.start();

    this.createEnemyWave();

    this.renderer.setAnimationLoop(this.update.bind(this));
  }

  createEnemyWave() {
    this.enemyManager.spawnEnemies(10 + (this.level * 2), 10 * (this.level * 2.5), 0.4 + this.level * 0.05);

    this.level++;

    this.ui.level = this.level;
  }

  update() {
    this.scene.update();
    this.camera.update();
    this.builder.update();
    this.enemyManager.update();
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  destroy() {
    window.removeEventListener('resize', this.resize.bind(this));

    this.builder.destroy();
  }
}
