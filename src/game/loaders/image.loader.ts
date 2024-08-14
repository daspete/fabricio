import { Texture, TextureLoader } from "three";

export class ImageLoader {
  loader: TextureLoader = new TextureLoader();
  loadedImages: Map<string, Texture> = new Map();

  async load(name: string, url: string): Promise<Texture> {
    if (this.loadedImages.has(name)) {
      return this.get(name);
    }
    const texture = await this.loader.loadAsync(url);
    this.loadedImages.set(name, texture);
    return this.get(name);
  }

  get(name: string): Texture {
    if(!this.loadedImages.has(name)) {
      throw new Error(`ImageLoader: Image ${name} not found`);
    }
    
    return this.loadedImages.get(name)!;
  }
}
