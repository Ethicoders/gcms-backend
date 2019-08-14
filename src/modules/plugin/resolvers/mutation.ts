import { ModuleContext } from '@graphql-modules/core';
import Plugin from '../providers/Plugin';

export default {
  Mutation: {
    updatePlugin: (root, { plugin }, { injector }: ModuleContext) => {
      injector.get(Plugin).updatePlugin(plugin);
      return {
        plugin,
      };
    },
  },
};
