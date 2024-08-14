import { AmbientLight, Color, DirectionalLight, FogExp2, Scene } from 'three';
import type { BaseGame } from '../base.game';

export class GameScene extends Scene {
  game: BaseGame;

  constructor(game: BaseGame) {
    super();

    this.game = game;

    this.background = new Color(0xcccccc);
    this.fog = new FogExp2(this.background, 0.002);

    const ambientLight = new AmbientLight(0x404040);
    this.add(ambientLight);

    const sunlight = new DirectionalLight(0xffffff, 1);
    sunlight.position.set(1, 1, 1).normalize();
    this.add(sunlight);
  }

  update() {}
}
