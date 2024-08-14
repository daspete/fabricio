import { PerspectiveCamera, Vector3 } from 'three';
import { MapControls } from 'three/examples/jsm/Addons.js';
import type { BaseGame } from '../base.game';

export class BaseCamera extends PerspectiveCamera {
  controls: MapControls;
  game: BaseGame;

  controlStartPosition: Vector3 = new Vector3();
  isPrimaryButtonDown: boolean = false;

  constructor(game: BaseGame, fov: number, aspect: number, near: number, far: number, position: Vector3) {
    super(fov, aspect, near, far);

    this.game = game;

    this.position.copy(position);

    this.controls = new MapControls(this, this.game.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.5;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 500;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.addEventListener('start', (event) => {
      this.controlStartPosition.copy(event.target.target);
    });
    this.controls.addEventListener('end', (event) => {
      if(this.controlStartPosition.distanceTo(event.target.target) < 0.3) {
        if(this.isPrimaryButtonDown) {
          this.game.builder.onPointerUp();
        }
      }
    });

    window.addEventListener('pointerdown', (event) => {
      this.isPrimaryButtonDown = event.button === 0;
    });
    window.addEventListener('pointerup', () => {
      setTimeout(() => {
        this.isPrimaryButtonDown = false;
      }, 0);
    });
  }

  update() {
    this.controls.update();
  }
}
