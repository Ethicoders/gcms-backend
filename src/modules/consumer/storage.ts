export const AUTH_PROVIDER = Symbol('AuthProvider');

export const store = [];

export default {
  provide: AUTH_PROVIDER,
  useValue: store,
};
