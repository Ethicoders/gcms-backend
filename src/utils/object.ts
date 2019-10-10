export const pathExists = (object: any, path: string) => {
  return path.split('.').reduce((obj, part) => obj && obj[part], object);
};
