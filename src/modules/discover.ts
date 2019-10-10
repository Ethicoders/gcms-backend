export const FORBIDDEN_TYPES = Symbol('ForbiddenTypes');

export default {
  provide: FORBIDDEN_TYPES,
  useValue: [], // Should maybe use WeakSet or Set instead
};
