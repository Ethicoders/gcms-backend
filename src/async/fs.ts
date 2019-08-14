import * as filesystem from 'fs';
import { promisify } from 'util';

type AsyncFilesystem = {
  readFile(
    path: filesystem.PathLike | number,
    options: { encoding?: null; flag?: string } | undefined | null,
  ): Promise<any>;
  readFile(
    path: filesystem.PathLike | number,
    options: { encoding: string; flag?: string } | string,
  ): Promise<any>;
  readFile(
    path: filesystem.PathLike | number,
    options:
      | { encoding?: string | null; flag?: string }
      | string
      | undefined
      | null,
  ): void;
  readFile(
    path: filesystem.PathLike | number,
  ): Promise<any>;

  writeFile(path: filesystem.PathLike | number, data: any): Promise<any>;
  writeFile(
    path: filesystem.PathLike | number,
    data: any,
    options: filesystem.WriteFileOptions,
  ): Promise<any>;
};

const functions: any = {};
['writeFile', 'readFile'].forEach(property => {
  functions[property] = promisify(filesystem[property]);
});

const fs: AsyncFilesystem = functions;

export = fs;
