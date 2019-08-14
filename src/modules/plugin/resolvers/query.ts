import { ModuleContext } from '@graphql-modules/core';
import Plugin from '../providers/Plugin';

export default {
  Query: {
    getPlugins: (root, args, { injector }: ModuleContext) =>
      injector.get(Plugin).getPlugins(),
  },
};
