import * as path from 'path';
import { writeFile, readFile } from '@/async/fs';

export default class {
  private path;

  public constructor(filePath: string) {
    this.path = path.normalize(filePath)
  }
    
  public async read() {
    return JSON.parse(await readFile(this.path));
  }

  public write(data: any[] | {}) {
    return writeFile(this.path, JSON.stringify(data, null, 2));
  }
}