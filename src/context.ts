export const authenticated = next => (root, args, context, info) => {
  console.log('context.user', context.user);
  return next(root, args, context, info);
};
