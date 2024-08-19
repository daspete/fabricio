import { Vector2 } from 'three';
import { BaseGame } from '../base.game';
import { BaseEnemy, DieReason } from './base.enemy';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class EnemyManager {
  game: BaseGame;

  enemies: BaseEnemy[] = [];

  constructor(game: BaseGame) {
    this.game = game;
  }

  async start() {
  
  }

  async spawnEnemies(count: number, energy: number, speedRange: number) {
    for (let i = 0; i < count; i++) {
      await this.createEnemy(energy, speedRange);
      await sleep(500);
    }
  }

  update() {
    this.enemies.forEach((enemy) => {
      enemy.update();
    });
  }

  async createEnemy(energy: number, speedRange: number) {
    const enemyStartPosition = new Vector2(0, Math.floor(Math.random() * this.game.ground.cellCountY));
    const enemyEndPosition = new Vector2(this.game.ground.cellCountX - 1, Math.floor(Math.random() * this.game.ground.cellCountY));

    const path = this.game.pathfinder.findPath(
      enemyStartPosition.x,
      enemyStartPosition.y,
      enemyEndPosition.x,
      enemyEndPosition.y
    );

    if (!path) {
      return;
    }

    const enemy = new BaseEnemy(this.game, energy, speedRange, this.game.level);
    await enemy.create(path, enemyEndPosition);
    this.enemies.push(enemy);
  }

  destroyEnemy(enemy: BaseEnemy, reason: DieReason) {
    this.enemies = this.enemies.filter((e) => e !== enemy);
    
    if(reason === DieReason.Killed) {
      this.game.ui.score += 10 + enemy.level * 5;
    }

    if(reason === DieReason.EndOfPath) {
      this.game.ui.score -= 10 + enemy.level * 5;
    }

    if(this.enemies.length === 0) {
      this.game.createEnemyWave();
    }
  }

  updateEnemyPathes() {
    this.enemies.forEach((enemy) => {
      enemy.updatePath();
    });
  }
}
