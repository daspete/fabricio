import { Group } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ModelLoader {
  loader: GLTFLoader = new GLTFLoader();
  loadedModels: Map<string, Group> = new Map();

  async load(name: string, url: string): Promise<Group> {
    if (this.loadedModels.has(name)) {
      return this.get(name);
    }
    const model = await this.loader.loadAsync(url);
    this.loadedModels.set(name, model.scene);
    return this.get(name);
  }

  get(name: string): Group {
    if (!this.loadedModels.has(name)) {
      throw new Error(`ModelLoader: Model ${name} not found`);
    }

    return this.loadedModels.get(name)!.clone();
  }
}
